import React from 'react';
import classNames from 'classnames';

/**
 * Utility code for building a 'KeySelector' component like when u select a size on an online store
 * [S] [M] [L] [XL] <-- u can only select one of these buttons at a time
 *                      and the selected option is stored in some parent state
 */

/**
 * Config function that returns a function that can create 'selectable' JSX button elements
 * @param  {object} displayNames      mapping of button key (as used in state) to display name (for UI)
 * @param  {string} btnClass          CSS classname of the button element
 * @param  {string} selectedClass     CSS classname for a selected button
 * @return {function}                 the button builder function that takes 3 args
 */
export const getButtonBuilder = (displayNames, btnClass, selectedClass='selected') => {
  return (key, selection, onSelect) => {
    return (
      <div
        key={key}
        className={classNames(btnClass, {[selectedClass]: selection === key})}
        onClick={() => onSelect(key)}
      >
        {displayNames[key]}
      </div>
    );
  }
}

/**
 * A generic class to avoid duplicated logic. hopefully this can be widely reused
 * @param  {string} options.containerClass   CSS classname for the button group
 * @param  {array} options.keyList           list of keys that identify buttons
 * @param  {string} options.selection        the selected key (parent state passed as prop)
 * @param  {function} options.buttonBuilder  function to render buttons with classNames behavior
 * @param  {function} options.onChange       callback to register selected key change w/ parent state
 * @return {React Component}                 Returns a component with clickable button-tab-things
 */
export const KeySelector = ({containerClass, keyList, selection, buttonBuilder, onChange}) => {
  return (
    <div className={containerClass}>
      {
        keyList.map((k) => (buttonBuilder(k, selection, onChange)))
      }
    </div>
  )
};
