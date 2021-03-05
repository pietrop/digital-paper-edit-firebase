const functions = require('firebase-functions');
// from https://github.com/pietrop/digital-paper-edit-electron/blob/master/src/ElectronWrapper/ffmpeg-remix/index.js
const async = require('async');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const cuid = require('cuid');
const os = require('os');
const rimraf = require('rimraf');

const ingest = (data, tmpDir, waveForm, waveFormMode, waveFormColor) => {
  functions.logger.log('ingest', data, tmpDir, waveForm, waveFormMode, waveFormColor);
  return (input, callback) => {
    const ff = ffmpeg(input.source);

    if (input.start) {
      ff.seekInput(input.start);
    } else {
      input.start = 0;
    }

    if (input.end) input.duration = input.end - input.start;
    if (input.duration) ff.duration(input.duration);

    input.path = path.join(tmpDir, `ingest-${cuid()}.ts`);

    //   ff.audioCodec('copy').videoCodec('copy');
    ff.videoCodec('libx264').audioCodec('aac');

    if (waveForm) {
      // default for waveform mode type
      let tmpWaveFormMode = 'p2p';
      // but also option to customise, within available options
      if (waveFormMode && (waveFormMode === 'p2p' || waveFormMode === 'cline' || waveFormMode === 'point' || waveFormMode === 'line')) {
        tmpWaveFormMode = waveFormMode;
      }
      let tmpWaveFormColor = 'Red';
      if (waveFormColor) {
        tmpWaveFormColor = waveFormColor;
      }
      // wave form reference https://trac.ffmpeg.org/wiki/Waveform
      // https://ffmpeg.org/ffmpeg-filters.html#showwaves
      // TODO: colour, and mode could be optional parameter, for mode eg line, point,p2p,cline.
      ff.complexFilter(`[0:a]showwaves=s=1920x1080:colors=${tmpWaveFormColor}:mode=${tmpWaveFormMode},format=yuv420p[v]`);
      // ff.complexFilter('[0:a]showwaves=s=1920x1080:colors=DodgerBlue:mode=cline,format=yuv420p[v]')
      ff.outputOption(['-map [v]', '-map', '0:a']);
    }
    ff.output(input.path);

    ff.on('start', (commandLine) => {
      functions.logger.log(`Spawned: ${commandLine}`);
    });

    ff.on('error', (err, stdout, stderr) => {
      functions.logger.log(err);
      callback(err, null);
    });

    ff.on('end', () => {
      functions.logger.log(`Created: ${input.path}`);
      callback(null, input);
    });

    ff.run();
  };
};

const concat = (data, tmpDir, callback) => {
  return (err, ingest) => {
    if (err) {
      console.error(err);
    }
    const ff = ffmpeg();

    const input = [];
    for (const segment of ingest) {
      input.push(segment.path);
    }

    ff.input(`concat:${input.join('|')}`);
    ff.output(data.output);

    ff.on('start', (commandLine) => {
      functions.logger.log(`Spawned: ${commandLine}`);
    });

    ff.on('error', (err, stdout, stderr) => {
      functions.logger.log(err);
      callback(err);
    });

    ff.on('end', () => {
      functions.logger.log(`Created: ${data.output}`);
      // Clean up and delete temp files .ts
      rimraf(`${tmpDir}/*.ts`, () => {
        functions.logger.log('delete .ts files');
      });
      callback(null, data);
    });

    ff.run();
  };
};

module.exports = function (data, waveForm, waveFormMode, waveFormColor, callback) {
  functions.logger.log('exports', data, waveForm, waveFormMode, waveFormColor);
  const tmpDir = os.tmpdir();
  if (data.limit) {
    async.mapLimit(data.input, data.limit, ingest(data, tmpDir, waveForm, waveFormMode, waveFormColor), concat(data, tmpDir, callback));
  } else {
    async.map(data.input, ingest(data, tmpDir, waveForm, waveFormMode, waveFormColor), concat(data, tmpDir, callback));
  }
};
