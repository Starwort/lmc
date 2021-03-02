const noArgMnemonics = { INP: 901, OUT: 902, OTC: 922, HLT: 0, COB: 0, DAT: 0 };
const oneArgMnemonics = { ADD: 100, SUB: 200, STA: 300, LDA: 500, BRA: 600, BRZ: 700, BRP: 800, DAT: 0 };
const allMnemonics = [
    'INP',
    'OUT',
    'OTC',
    'HLT',
    'COB',
    'ADD',
    'SUB',
    'STA',
    'LDA',
    'BRA',
    'BRZ',
    'BRP',
    'DAT',
];
export { noArgMnemonics, oneArgMnemonics, allMnemonics };
