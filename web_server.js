'use strict';

const path = require('path');
const pfs = require('fs/promises');

const Koa = require('koa');

const Cell = require('./cell');
const Display = require('./display');
const Layer = require('./layer');
const log = require('./log');

const calculateBoardArray = function (action) {
  const output_layer = new Layer(Display.getNumCells());
  action.applyToLayer(output_layer);

  const grid_width = Cell.getGridWidth();

  const board_array = [];
  for (let y = 0; y < Cell.getGridHeight(); y++) {
    const row = [];
    for (let x = 0; x < Cell.getGridWidth() * output_layer.getNumCells(); x++) {
      row.push([0, 0, 0]);
    }
    board_array.push(row);
  }

  for (const [cell_index, segment_index, color] of output_layer.segmentEntries()) {
    const base_x = cell_index * grid_width;
    const base_y = 0;
    for (const [x, y] of Cell.getSegmentGridCoords(segment_index)) {
      board_array[base_y + y][base_x + x] = color;
    }
  }

  return board_array;
}

exports.listen = function (port, action_runner) {
  const server = new Koa();
  server.use(async (ctx) => {
    if (ctx.path === '/favicon.ico') {
      return;
    }
    if (ctx.path === '/is-done') {
      ctx.type = 'application/json';
      ctx.body = JSON.stringify(action_runner.getAction().getStatusIsDone(), null, 2);
      return;
    }
    if (ctx.path === '/status') {
      ctx.type = 'application/json';
      ctx.body = JSON.stringify(action_runner.getAction(), null, 2);
      return;
    }

    if (ctx.path === '/') {

      const board_array = calculateBoardArray(action_runner.getAction());
      ctx.type = 'text/html';
      const template = await pfs.readFile(path.join(__dirname, 'home.html'), {encoding: 'utf8'});
      const html = template.replace(/\$\{board_array\}/ui, JSON.stringify(board_array));
      ctx.body = html;
      return;
    }

    ctx.status = 404;
    ctx.body = '404 Page not found';
  });

  server.on('error', (err, ctx) => {
    log.error('server error', err, ctx)
  });

  server.listen(port);
};
