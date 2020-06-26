'use strict';

const Action = require('./action');
const ConcatenateAction = require('./concatenate_action');
const DelayAction = require('./delay_action');
const FadeToColorAction = require('./fade_to_color_action');
const log = require('./log');
const MaskLeftToRightAction = require('./mask_left_to_right_action');
const MaskTopToBottomAction = require('./mask_top_to_bottom_action');
const RepeatAction = require('./repeat_action');
const ScrollAction = require('./scroll_action');
const SequentialAction = require('./sequential_action');
const SetColorAction = require('./set_color_action');
const SetOnAction = require('./set_on_action');
const SetToRainbowByCellAction = require('./set_to_rainbow_by_cell_action');
const SetToRainbowBySegmentAction = require('./set_to_rainbow_by_segment_action');
const StaticMessageAction = require('./static_message_action');

class ActionTree {

  static createActionFromData(options) {
    const child_actions = [];
    if (options.child_actions) {
      for (const action_data of options.child_actions) {
        const action = ActionTree.createActionFromData(action_data);
        child_actions.push(action);
      }
    }

    const create_options = {
      ...options,
      child_actions,
    };
    switch (options.type) {
    case 'concatenate':
      return new ConcatenateAction(create_options);
    case 'default':
      return new Action(create_options);
    case 'delay':
      return new DelayAction(create_options);
    case 'fade_to_color':
      return new FadeToColorAction(create_options);
    case 'mask_left_to_right_action':
      return new MaskLeftToRightAction(create_options);
    case 'mask_top_to_bottom_action':
      return new MaskTopToBottomAction(create_options);
    case 'repeat':
      return new RepeatAction(create_options);
    case 'scroll':
      return new ScrollAction(create_options);
    case 'sequential':
      return new SequentialAction(create_options);
    case 'set_on':
      return new SetOnAction(create_options);
    case 'set_to_rainbow_by_cell':
      return new SetToRainbowByCellAction(create_options);
    case 'set_to_rainbow_by_segment':
      return new SetToRainbowBySegmentAction(create_options);
    case 'static_message':
      return new StaticMessageAction(create_options);
    case 'set_color':
      return new SetColorAction(create_options);
    default:
      log.error('unknown action type', options.type, options);
      throw new Error('UnknownActionType');
    }
  }
}

module.exports = ActionTree;
