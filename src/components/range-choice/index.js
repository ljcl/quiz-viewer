import { h, Component } from 'preact';
import style from './style.scss';
import markdown from 'marked';
import classnames from 'classnames/bind';
import Explanation from '../explanation';

const Tick = require('!desvg-loader/preact!svg-loader!../../images/tick.svg');

const cn = classnames.bind(style);

class RangeChoice extends Component {
  constructor() {
    super();
    this.handleInteraction = this.handleInteraction.bind(this);
    this.handleAnswer = this.handleAnswer.bind(this);
  }

  componentDidMount() {
    const { min, max } = this.props.question;
    this.setState({
      response: Math.round((max - min) / 2)
    });
  }

  handleAnswer(answerId) {
    const { id, type, value, answer, lenience } = this.props.question;
    const { response } = this.state;

    const score =
      lenience > 0
        ? value *
          (1 - Math.min(lenience, Math.abs(answer - response)) / lenience)
        : response === answer ? value : 0;

    // Pass response data back to quiz for recording.
    this.props.handleResponse(
      Object.assign({}, { id, type, value, score, response })
    );

    this.setState({ finalised: true, isCorrect: score >= response });
  }

  handleInteraction(e) {
    let { prefix, suffix } = this.props.question;
    let response = e.target.value;
    this.setState({
      response,
      interacted: true,
      answerText: prefix + response + suffix
    });
  }

  render(
    { question, className, confirmAnswer, displayResult },
    { answers, isCorrect, answerText, response, finalised, interacted }
  ) {
    let {
      description,
      explanation,
      answer,
      min,
      max,
      step,
      prefix,
      suffix
    } = question;
    let questionText = question.question;

    return (
      <div className={cn(className)}>
        <h2>{questionText}</h2>
        {description ? (
          <div
            dangerouslySetInnerHTML={{
              __html: markdown(description)
            }}
          />
        ) : null}
        <div className={cn(style.answer)}>
          <span
            style={`left: ${(response - 1) / (max - min) * 100}%`}
            aria-hidden={interacted ? true : false}
            className={cn(style.answerText)}
          >
            {answerText || 'Answer using the slider below'}
          </span>
          <span
            style={`left: ${((finalised ? answer : response) - 1) /
              (max - min) *
              100}%; opacity: ${finalised ? '1' : '0'};`}
            className={cn(style.answerText, style.answerCorrect)}
          >
            {finalised ? answer : null}
          </span>
        </div>
        <div className={cn(style.control)}>
          <input
            aria-valuemin={min}
            aria-valuemax={max}
            onMouseDown={this.handleInteraction}
            onTouchStart={this.handleInteraction}
            onInput={this.handleInteraction}
            className={cn(style.input)}
            type="range"
            disabled={finalised}
            value={response}
            min={min}
            max={max}
            step={step}
          />
          <div aria-hidden="true" className={cn(style.min)}>
            {prefix}
            {min}
            {suffix}
          </div>
          <div aria-hidden="true" className={cn(style.max)}>
            {prefix}
            {max}
            {suffix}
          </div>
        </div>
        <button
          disabled={finalised || !interacted}
          onClick={finalised ? null : this.handleAnswer}
          className={cn(style.btn, style.btnFilled)}
        >
          Submit
        </button>
      </div>
    );
  }
}

module.exports = RangeChoice;
