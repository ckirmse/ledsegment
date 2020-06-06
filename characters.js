const character_map = {
  ' ': 0b0000000000000000,
  '0': 0b0000010100111111 ,
  '1': 0b0000000100000110,
  '2': 0b0000000011011011,
  '3': 0b0000000011001111,
  '4': 0b0000000011100110,
  '5': 0b0000000011101101,
  '6': 0b0000000011111100,
  '7': 0b0010000100000001,
  '8': 0b0000000011111111,
  '9': 0b0000000011100111,
  'a': 0b0000000011110111,
  'b': 0b0011000010001111,
  'c': 0b0000000000111001,
  'd': 0b0011000000001111,
  'e': 0b0000000011111001,
  'f': 0b0000000001110001,
  'g': 0b0000000010111101,
  'h': 0b0000000011110110,
  'i': 0b0011000000001001,
  'j': 0b0000000000011110,
  'k': 0b0000100101110000,
  'l': 0b0000000000111000,
  'm': 0b0000001100110110,
  'n': 0b0000101000110110,
  'o': 0b0000000000111111,
  'p': 0b0000000011110011,
  'q': 0b0000100000111111,
  'r': 0b0000100101110001,
  's': 0b0000001010001101,
  't': 0b0011000000000001,
  'u': 0b0000000000111110,
  'v': 0b0000010100110000,
  'w': 0b0000110000110110,
  'x': 0b0000111100000000,
  'y': 0b0010001100000000,
  'z': 0b0000010100001001,

  'A': 0b0000000011110111,
  'B': 0b0011000010001111,
  'C': 0b0000000000111001,
  'D': 0b0011000000001111,
  'E': 0b0000000011111001,
  'F': 0b0000000001110001,
  'G': 0b0000000010111101,
  'H': 0b0000000011110110,
  'I': 0b0011000000001001,
  'J': 0b0000000000011110,
  'K': 0b0000100101110000,
  'L': 0b0000000000111000,
  'M': 0b0000001100110110,
  'N': 0b0000101000110110,
  'O': 0b0000000000111111,
  'P': 0b0000000011110011,
  'Q': 0b0000100000111111,
  'R': 0b0000100101110001,
  'S': 0b0000001010001101,
  'T': 0b0011000000000001,
  'U': 0b0000000000111110,
  'V': 0b0000010100110000,
  'W': 0b0000110000110110,
  'X': 0b0000111100000000,
  'Y': 0b0010001100000000,
  'Z': 0b0000010100001001,

  '*': 0b0011111100000000,
  '+': 0b0011000011000000,
  '-': 0b0000000011000000,
  '/': 0b0000010100000000,
  '\\':0b0000101000000000,
  '<': 0b0000100100000000,
  '>': 0b0000011000000000,
  '|': 0b0011000000000000,
  '$': 0b0011000011101101,
  '?': 0b0010000010000011,

  '!': 0b0000000000000110,
  '#': 0b0011000011001110,
  '%': 0b0000010100100100,
  '&': 0b0000101101011001,
  '`': 0b0000001000000000,
  '\'':0b0000000100000000,
  '"': 0b0001000100000000,
  '[': 0b0000000000111001,
  ']': 0b0000000000001111,
  ':': 0b0000000000000010,
  '(': 0b0000100100000000,
  ')': 0b0000011000000000,

  '=': 0b0000000011001000,
  '_': 0b0000000000001000,
  '{': 0b0000011001001001,
  '}': 0b0000100110001001,
  // need to add parentheses
};

/*
# 8 tall, 7 wide
coords = (
    (3, 0), # top
    (6, 2), # rest of O vvv
    (6, 6),
    (3, 8),
    (0, 6),
    (0, 2),
    (2, 4), # middle horizontal
    (4, 4), # middle horizontal
    (5, 2), # X starting at top right, counter clockwise vvv
    (1, 2),
    (1, 6),
    (5, 6),
    (3, 2), # | top
    (3, 6), # | bottom
    (7, 8), # .
);
*/

module.exports.getSegmentBitsForCharacter = function (ch) {
  if (!Object.prototype.hasOwnProperty.call(character_map, ch)) {
    return 0;
  }
  return character_map[ch];
}
