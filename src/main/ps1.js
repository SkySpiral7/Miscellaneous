'use strict';

//const path = require('fs');
//const fs = require('fs');
const childProcess = require('child_process');
const SUCCESS_CODE = 0;
const TRAILING_NEWLINE_REGEX = /\r?\n$/;

/*
https://nodejs.org/api/child_process.html#child_processspawnsynccommand-args-options
returns:
pid <number> Pid of the child process.
output <Array> Array of results from stdio output.
stdout <Buffer> | <string> The contents of output[1].
stderr <Buffer> | <string> The contents of output[2].
status <number> | <null> The exit code of the subprocess, or null if the subprocess terminated due to a signal.
signal <string> | <null> The signal used to kill the subprocess, or null if the subprocess did not terminate due to a signal.
error <Error> The error object if the child process failed or timed out.
*/

/**
 * @typedef { import('child_process').SpawnSyncReturns<string> & {isSuccessful: boolean } } ShellResult
 */

/**
 * Runs command on '/bin/sh' on Unix and 'process.env.ComSpec' if available, otherwise 'cmd.exe' on Windows.
 * If the command returns a non-successful error code, times out, or the process fails then the error is returned.
 *
 * @param { string | string[] } commandArg
 * @param { { cwd?: string, envVar?: Object.<string, string> } } options
 * @returns { ShellResult } result from the shell
 */
const execShellOrReturnError = (command, options = {}) => {
  if (!command) {
    throw new Error('empty arg passed as command');
  }

  const result = childProcess.spawnSync(command, {
    stdio: 'pipe',
    encoding: 'utf8',
    shell: true,
    windowsHide: true,
    env: options.envVar,
    cwd: options.cwd,
  });

  result.stdout = result.stdout.replace(TRAILING_NEWLINE_REGEX, '');
  result.stderr = result.stderr.replace(TRAILING_NEWLINE_REGEX, '');

  const isSuccessful = !result.error && result.status === SUCCESS_CODE;
  return { ...result, isSuccessful };
};

/**
 * Runs command on '/bin/sh' on Unix and 'process.env.ComSpec' if available, otherwise 'cmd.exe' on Windows.
 * If the command returns a non-successful error code, times out, or the process fails then an exception is thrown.
 *
 * @param { string | string[] } commandArg
 * @param { { cwd?: string, envVar?: Object.<string, string> } } options
 * @returns { ShellResult } result from the shell
 * @throws { ShellResult | Error}
 */
const execShellOrThrow = (command, options = {}) => {
  const result = execShellOrReturnError(command, options);

  if (result.isSuccessful) {
    return result;
  } else {
    const exceptionMessage = result.error ? result.error.message : undefined;
    const commandFailureReason = exceptionMessage || result.stderr || 'unknown error';
    const userErrorMessage = `Command failed: ${command}\n${commandFailureReason}`;

    console.error(userErrorMessage);
    throw result;
  }
};

const sh = execShellOrThrow;

const main = () => {
   let prompt='\n';
   prompt+=appendPath();

   //TODO: might be a better way
   if (sh('whoami').stdout == 'root')
   {
      //This stands out from $ as much as possible
      //TODO: add color
      prompt+="With great power comes great responsibility:";
   }
   else
   {
      prompt+=appendGit();
      prompt+='$';
   }
   console.log(`${prompt} `);
};
//TODO: appendGit
//TODO: appendPath

module.exports = {
  PS1: main,
  shCatch: execShellOrReturnError,
  sh: execShellOrThrow
};
