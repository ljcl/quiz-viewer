const { h } = require('preact');
module.exports = ({ className, ariaHidden }) => {
  return (
    <svg
      aria-label="incorrect"
      aria-hidden={ariaHidden}
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Cross</title>
      <g fill="none" fill-rule="evenodd">
        <path d="M0 0h24v24H0z" />
        <path
          d="M3 4.5L4.5 3l7.5 7.5L19.5 3 21 4.5 13.5 12l7.5 7.5-1.5 1.5-7.5-7.5L4.5 21 3 19.5l7.5-7.5L3 4.5z"
          fill="#000"
        />
      </g>
    </svg>
  );
};
