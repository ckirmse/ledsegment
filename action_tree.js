'use strict';

const path = require('path');
const {promises: pfs} = require('fs');

const log = require('./log');

const action_classes = {};

class ActionTree {

  static async init () {

    action_classes.default = require('./action');

    const dirname = path.join(__dirname, 'actions');
    const filenames = await pfs.readdir(dirname);
    for (const filename of filenames) {
      if ((/.*\.js$/u).test(filename) === false) {
        continue;
      }

      const pathname = path.format({
        dir: dirname,
        base: filename,
      });
      const action = require(pathname);

      const path_obj = path.parse(pathname);
      action_classes[path_obj.name] = action;
    }
  }

  static createActionFromData(options) {
    const child_actions = [];
    if (options.child_actions) {
      for (const action_data of options.child_actions) {
        let action;
        try {
          action = ActionTree.createActionFromData(action_data);
        } catch (err) {
          log.info('exception in', action_data);
          throw err;
        }
        child_actions.push(action);
      }
    }

    if (!Object.prototype.hasOwnProperty.call(action_classes, options.type)) {
      log.error('unknown action type', options.type, options);
      throw new Error('UnknownActionType');
    }

    const create_options = {
      type: options.type,
      ...options,
      child_actions,
    };
    return new action_classes[options.type](create_options);
  }
}

module.exports = ActionTree;
