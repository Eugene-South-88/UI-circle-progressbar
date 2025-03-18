class ProgressBar extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({mode: 'open'});

    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        @import url("./ProgressBar.css");
      </style>
   <div class="circle">
          <svg class="progress-ring">
            <circle
              class="progress-ring__circle-background"
              fill="transparent"
              stroke="#EFF3F6"
              stroke-width="10"
              cx="60"
              cy="60"
              r="52"
            />
            <circle
              class="progress-ring__circle no-animation"
              fill="transparent"
              stroke="#0065FF"
              stroke-width="10"
              cx="60"
              cy="60"
              r="52"
            />
          </svg>
        </div>
    `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.circle = this.shadowRoot.querySelector('.progress-ring__circle');
    this.circleBackground = this.shadowRoot.querySelector('.progress-ring__circle-background');
    const circleRadius = this.circle.r.baseVal.value;
    this.circumference = 2 * Math.PI * circleRadius;

    this._value = 50;
    this._animated = true;
    this._hidden = false;

    this.updateArc(this._value);
    this.toggleAnimation(this._animated);
    this.toggleHide(this._hidden);
  }

  static get observedAttributes() {
    return ['value', 'animated', 'hidden'];
  }

  get value() {
    return this._value;
  }

  set value(newValue) {
    if (newValue < 0) newValue = 0;
    if (newValue > 100) newValue = 100;
    this._value = newValue;
    this.updateArc(newValue);
  }

  get animated() {
    return this._animated;
  }

  set animated(isAnimated) {
    this._animated = isAnimated;
    this.toggleAnimation(isAnimated);
  }

  get hidden() {
    return this._hidden;
  }

  set hidden(isHidden) {
    this._hidden = isHidden;
    this.toggleHide(isHidden);
  }

  updateArc(value) {
    this.circle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
    this.circle.style.strokeDashoffset = this.circumference;

    const offset = this.circumference - (value / 100 * this.circumference);
    this.circle.style.strokeDashoffset = offset;
  }

  toggleAnimation(isAnimated) {
    isAnimated
      ? this.circle.classList.remove('no-animation')
      : this.circle.classList.add('no-animation');
  }

  toggleHide(isHidden) {
    this.shadowRoot.querySelector('.circle').style.display = isHidden ? 'none' : 'block';
  }
}

customElements.define('progress-bar', ProgressBar);
