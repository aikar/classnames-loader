# classnamesplus-loader

[![npm version](https://img.shields.io/npm/v/classnamesplus-loader.svg?style=flat-square)](https://www.npmjs.com/package/classnamesplus-loader)

This is a webpack loader that automatically bind [css-modules](https://github.com/css-modules/css-modules) to [classnames](https://github.com/JedWatson/classnames).

This is a modified version of the original classnames-loader with changed behavior. I'm not sure my changes fit with the
authors intent for classnames-loader as it does more than just classnames binding, so decided to fork and rename the project.

This module will bind exports to classnames, but also used with css-modules, will include the normal and module name so both are
in the class list still (useful for automated tests where module based class names are not reliable)

This version also provides a mergeStyles method. This will take 2 classnames instances, and combine the classnames.
 
So if you have a base button stylesheet, and take that stylesheet and call .mergeStyles() with another stylesheet,
the resulting stylesheet will have classes for both. See example below.
 
This is primarily for taking presentational components, and letting the user of the component
pass in an additional style object to extend the base one with, enabling overrides.

### Installation

```
npm install --save-dev classnamesplus-loader
```

## API
### mergeStyles
```javascript
import styles from "./styles.css";
import styles1 from "../styles1.css";
import styles2 from "../styles2.css";

const newStyles = styles.mergeStyles(styles1, styles2);
//styles.myStyle = myStyle styles_myStyle
// newStyles.myStyle = myStyle styles_myStyle styles1_myStyle styles2_myStyle
```

### importStyles
```javascript
import styles from "./styles.css";
import styles1 from "../styles1.css";
import styles2 from "../styles2.css";

styles.importStyles(styles1, styles2);

// styles.myStyle = myStyle styles_myStyle styles1_myStyle styles2_myStyle
```


## Usage

To enable this loader add `classnamesplus-loader` before `style-loader` in webpack config: 

```js
{
  test: /\.css$/,
  loader: 'classnamesplus-loader!style-loader!css-loader')
}
```

If you're using `ExtractTextPlugin` your webpack config should look like this:

```js
{
  test: /\.css$/,
  loaders: ['classnamesplus-loader', ExtractTextPlugin.extract('style-loader', 'css-loader')])
}
```

Example usage in component:

```js
import { Component } from 'react';
import baseButton from '../buttons.css';
import buttonStyles from './submit-button.css';
const cx = baseButton.mergeStyles(buttonStyles); // styles now have base button classes, with buttonStyles appended after it
// example: cx.base = base BaseButton_base SubmitButton_base 

export default class SubmitButton extends Component {
  render () {
    let text = this.props.store.submissionInProgress ? 'Processing...' : 'Submit';
    let className = cx({
      base: true,
      inProgress: this.props.store.submissionInProgress,
      error: this.props.store.errorOccurred,
      disabled: !this.props.form.valid,
    });
    return <button className={className}>{text}</button>;
  } 
}
```

You can also access the class names just as you would do that with [css-modules](https://github.com/css-modules/css-modules):

```js
import { Component } from 'react';
import styles from './submit-button.css';

export default class SubmitButton extends Component {
  render () {
    let text = this.props.store.submissionInProgress ? 'Processing...' : 'Submit';
    return <button className={styles.submitButton}>{text}</button>;
  } 
}
```

Sadly, `babel-plugin-react-css-modules` does not appear to be using the combined class names for `styleName`.
It appears it is due to that plugin resolving to the module imported directly, and not using the actual variable
in scope.

You will need to use `className={cx('base', 'button')}` syntax.

To be honest, forcing that plugin to get the combined classes was a goal of this extension, but didn't work out as I had hoped.


## Thanks
[@itsmepetrov](https://github.com/itsmepetrov) for original [classnames-loader](https://github.com/itsmepetrov/classnames-loader)
[@JedWatson](https://github.com/JedWatson) for [classnames](https://github.com/JedWatson/classnames) module

## License

[MIT](LICENSE.md)
