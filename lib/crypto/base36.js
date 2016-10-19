/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

const random = require('./random')

function base36(len) {
  let out = []
  return random(len)
    .then(bytes => {
      let bytesLen = bytes.length
      for (let i = 0; i < bytesLen; i++) {
        let b = bytes[i]
        // 252-256 skews the base36 distribution, so skip those bytes
        if (b < 252) {
          out.push((b % 36).toString(36))
        }
      }

      if (len > bytesLen) {
        return base36(len - bytesLen)
      }
    })
    .then(tail => {
      if (tail) {
        out = out.concat(tail)
      }
      return out.join('').toUpperCase()
    })
}

module.exports = (len) => {
  return () => {
    return base36(len)
  }
}
