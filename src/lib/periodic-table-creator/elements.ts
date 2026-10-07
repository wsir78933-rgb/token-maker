export type PeriodicElementCategory =
  | 'alkali-metal'
  | 'alkaline-earth-metal'
  | 'transition-metal'
  | 'post-transition-metal'
  | 'metalloid'
  | 'reactive-nonmetal'
  | 'halogen'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide';

export type PeriodicElement = {
  atomicNumber: number;
  symbol: string;
  name: string;
  nameZh: string;
  atomicMass: string;
  massIsBracketed: boolean;
  category: PeriodicElementCategory;
};

/**
 * Names and standard atomic weights follow the IUPAC table dated 4 May 2022. PubChem's
 * machine-readable table is used as a second check for the symbols, names, and
 * displayed precision. Bracketed masses are the mass numbers of the longest
 * lived or best-characterized isotope where no standard atomic weight exists.
 *
 * Sources:
 * https://iupac.org/what-we-do/periodic-table-of-elements/
 * https://pubchem.ncbi.nlm.nih.gov/periodic-table/
 */
export const PERIODIC_ELEMENT_SOURCES = {
  iupac: 'https://iupac.org/what-we-do/periodic-table-of-elements/',
  pubchem: 'https://pubchem.ncbi.nlm.nih.gov/periodic-table/',
} as const;

export const PERIODIC_ELEMENTS = [
  { atomicNumber: 1, symbol: 'H', name: 'Hydrogen', nameZh: '氢', atomicMass: '1.008', massIsBracketed: false, category: 'reactive-nonmetal' },
  { atomicNumber: 2, symbol: 'He', name: 'Helium', nameZh: '氦', atomicMass: '4.0026', massIsBracketed: false, category: 'noble-gas' },
  { atomicNumber: 3, symbol: 'Li', name: 'Lithium', nameZh: '锂', atomicMass: '6.94', massIsBracketed: false, category: 'alkali-metal' },
  { atomicNumber: 4, symbol: 'Be', name: 'Beryllium', nameZh: '铍', atomicMass: '9.0122', massIsBracketed: false, category: 'alkaline-earth-metal' },
  { atomicNumber: 5, symbol: 'B', name: 'Boron', nameZh: '硼', atomicMass: '10.81', massIsBracketed: false, category: 'metalloid' },
  { atomicNumber: 6, symbol: 'C', name: 'Carbon', nameZh: '碳', atomicMass: '12.011', massIsBracketed: false, category: 'reactive-nonmetal' },
  { atomicNumber: 7, symbol: 'N', name: 'Nitrogen', nameZh: '氮', atomicMass: '14.007', massIsBracketed: false, category: 'reactive-nonmetal' },
  { atomicNumber: 8, symbol: 'O', name: 'Oxygen', nameZh: '氧', atomicMass: '15.999', massIsBracketed: false, category: 'reactive-nonmetal' },
  { atomicNumber: 9, symbol: 'F', name: 'Fluorine', nameZh: '氟', atomicMass: '18.998', massIsBracketed: false, category: 'halogen' },
  { atomicNumber: 10, symbol: 'Ne', name: 'Neon', nameZh: '氖', atomicMass: '20.180', massIsBracketed: false, category: 'noble-gas' },
  { atomicNumber: 11, symbol: 'Na', name: 'Sodium', nameZh: '钠', atomicMass: '22.990', massIsBracketed: false, category: 'alkali-metal' },
  { atomicNumber: 12, symbol: 'Mg', name: 'Magnesium', nameZh: '镁', atomicMass: '24.305', massIsBracketed: false, category: 'alkaline-earth-metal' },
  { atomicNumber: 13, symbol: 'Al', name: 'Aluminium', nameZh: '铝', atomicMass: '26.982', massIsBracketed: false, category: 'post-transition-metal' },
  { atomicNumber: 14, symbol: 'Si', name: 'Silicon', nameZh: '硅', atomicMass: '28.085', massIsBracketed: false, category: 'metalloid' },
  { atomicNumber: 15, symbol: 'P', name: 'Phosphorus', nameZh: '磷', atomicMass: '30.974', massIsBracketed: false, category: 'reactive-nonmetal' },
  { atomicNumber: 16, symbol: 'S', name: 'Sulfur', nameZh: '硫', atomicMass: '32.06', massIsBracketed: false, category: 'reactive-nonmetal' },
  { atomicNumber: 17, symbol: 'Cl', name: 'Chlorine', nameZh: '氯', atomicMass: '35.45', massIsBracketed: false, category: 'halogen' },
  { atomicNumber: 18, symbol: 'Ar', name: 'Argon', nameZh: '氩', atomicMass: '39.95', massIsBracketed: false, category: 'noble-gas' },
  { atomicNumber: 19, symbol: 'K', name: 'Potassium', nameZh: '钾', atomicMass: '39.098', massIsBracketed: false, category: 'alkali-metal' },
  { atomicNumber: 20, symbol: 'Ca', name: 'Calcium', nameZh: '钙', atomicMass: '40.078', massIsBracketed: false, category: 'alkaline-earth-metal' },
  { atomicNumber: 21, symbol: 'Sc', name: 'Scandium', nameZh: '钪', atomicMass: '44.956', massIsBracketed: false, category: 'transition-metal' },
  { atomicNumber: 22, symbol: 'Ti', name: 'Titanium', nameZh: '钛', atomicMass: '47.867', massIsBracketed: false, category: 'transition-metal' },
  { atomicNumber: 23, symbol: 'V', name: 'Vanadium', nameZh: '钒', atomicMass: '50.942', massIsBracketed: false, category: 'transition-metal' },
  { atomicNumber: 24, symbol: 'Cr', name: 'Chromium', nameZh: '铬', atomicMass: '51.996', massIsBracketed: false, category: 'transition-metal' },
  { atomicNumber: 25, symbol: 'Mn', name: 'Manganese', nameZh: '锰', atomicMass: '54.938', massIsBracketed: false, category: 'transition-metal' },
  { atomicNumber: 26, symbol: 'Fe', name: 'Iron', nameZh: '铁', atomicMass: '55.845', massIsBracketed: false, category: 'transition-metal' },
  { atomicNumber: 27, symbol: 'Co', name: 'Cobalt', nameZh: '钴', atomicMass: '58.933', massIsBracketed: false, category: 'transition-metal' },
  { atomicNumber: 28, symbol: 'Ni', name: 'Nickel', nameZh: '镍', atomicMass: '58.693', massIsBracketed: false, category: 'transition-metal' },
  { atomicNumber: 29, symbol: 'Cu', name: 'Copper', nameZh: '铜', atomicMass: '63.546', massIsBracketed: false, category: 'transition-metal' },
  { atomicNumber: 30, symbol: 'Zn', name: 'Zinc', nameZh: '锌', atomicMass: '65.38', massIsBracketed: false, category: 'transition-metal' },
  { atomicNumber: 31, symbol: 'Ga', name: 'Gallium', nameZh: '镓', atomicMass: '69.723', massIsBracketed: false, category: 'post-transition-metal' },
  { atomicNumber: 32, symbol: 'Ge', name: 'Germanium', nameZh: '锗', atomicMass: '72.630', massIsBracketed: false, category: 'metalloid' },
  { atomicNumber: 33, symbol: 'As', name: 'Arsenic', nameZh: '砷', atomicMass: '74.922', massIsBracketed: false, category: 'metalloid' },
  { atomicNumber: 34, symbol: 'Se', name: 'Selenium', nameZh: '硒', atomicMass: '78.971', massIsBracketed: false, category: 'reactive-nonmetal' },
  { atomicNumber: 35, symbol: 'Br', name: 'Bromine', nameZh: '溴', atomicMass: '79.904', massIsBracketed: false, category: 'halogen' },
  { atomicNumber: 36, symbol: 'Kr', name: 'Krypton', nameZh: '氪', atomicMass: '83.798', massIsBracketed: false, category: 'noble-gas' },
  { atomicNumber: 37, symbol: 'Rb', name: 'Rubidium', nameZh: '铷', atomicMass: '85.468', massIsBracketed: false, category: 'alkali-metal' },
  { atomicNumber: 38, symbol: 'Sr', name: 'Strontium', nameZh: '锶', atomicMass: '87.62', massIsBracketed: false, category: 'alkaline-earth-metal' },
  { atomicNumber: 39, symbol: 'Y', name: 'Yttrium', nameZh: '钇', atomicMass: '88.906', massIsBracketed: false, category: 'transition-metal' },
  { atomicNumber: 40, symbol: 'Zr', name: 'Zirconium', nameZh: '锆', atomicMass: '91.224', massIsBracketed: false, category: 'transition-metal' },
  { atomicNumber: 41, symbol: 'Nb', name: 'Niobium', nameZh: '铌', atomicMass: '92.906', massIsBracketed: false, category: 'transition-metal' },
  { atomicNumber: 42, symbol: 'Mo', name: 'Molybdenum', nameZh: '钼', atomicMass: '95.95', massIsBracketed: false, category: 'transition-metal' },
  { atomicNumber: 43, symbol: 'Tc', name: 'Technetium', nameZh: '锝', atomicMass: '[97]', massIsBracketed: true, category: 'transition-metal' },
  { atomicNumber: 44, symbol: 'Ru', name: 'Ruthenium', nameZh: '钌', atomicMass: '101.07', massIsBracketed: false, category: 'transition-metal' },
  { atomicNumber: 45, symbol: 'Rh', name: 'Rhodium', nameZh: '铑', atomicMass: '102.91', massIsBracketed: false, category: 'transition-metal' },
  { atomicNumber: 46, symbol: 'Pd', name: 'Palladium', nameZh: '钯', atomicMass: '106.42', massIsBracketed: false, category: 'transition-metal' },
  { atomicNumber: 47, symbol: 'Ag', name: 'Silver', nameZh: '银', atomicMass: '107.87', massIsBracketed: false, category: 'transition-metal' },
  { atomicNumber: 48, symbol: 'Cd', name: 'Cadmium', nameZh: '镉', atomicMass: '112.41', massIsBracketed: false, category: 'transition-metal' },
  { atomicNumber: 49, symbol: 'In', name: 'Indium', nameZh: '铟', atomicMass: '114.82', massIsBracketed: false, category: 'post-transition-metal' },
  { atomicNumber: 50, symbol: 'Sn', name: 'Tin', nameZh: '锡', atomicMass: '118.71', massIsBracketed: false, category: 'post-transition-metal' },
  { atomicNumber: 51, symbol: 'Sb', name: 'Antimony', nameZh: '锑', atomicMass: '121.76', massIsBracketed: false, category: 'metalloid' },
  { atomicNumber: 52, symbol: 'Te', name: 'Tellurium', nameZh: '碲', atomicMass: '127.60', massIsBracketed: false, category: 'metalloid' },
  { atomicNumber: 53, symbol: 'I', name: 'Iodine', nameZh: '碘', atomicMass: '126.90', massIsBracketed: false, category: 'halogen' },
  { atomicNumber: 54, symbol: 'Xe', name: 'Xenon', nameZh: '氙', atomicMass: '131.29', massIsBracketed: false, category: 'noble-gas' },
  { atomicNumber: 55, symbol: 'Cs', name: 'Caesium', nameZh: '铯', atomicMass: '132.91', massIsBracketed: false, category: 'alkali-metal' },
  { atomicNumber: 56, symbol: 'Ba', name: 'Barium', nameZh: '钡', atomicMass: '137.33', massIsBracketed: false, category: 'alkaline-earth-metal' },
  { atomicNumber: 57, symbol: 'La', name: 'Lanthanum', nameZh: '镧', atomicMass: '138.91', massIsBracketed: false, category: 'lanthanide' },
  { atomicNumber: 58, symbol: 'Ce', name: 'Cerium', nameZh: '铈', atomicMass: '140.12', massIsBracketed: false, category: 'lanthanide' },
  { atomicNumber: 59, symbol: 'Pr', name: 'Praseodymium', nameZh: '镨', atomicMass: '140.91', massIsBracketed: false, category: 'lanthanide' },
  { atomicNumber: 60, symbol: 'Nd', name: 'Neodymium', nameZh: '钕', atomicMass: '144.24', massIsBracketed: false, category: 'lanthanide' },
  { atomicNumber: 61, symbol: 'Pm', name: 'Promethium', nameZh: '钷', atomicMass: '[145]', massIsBracketed: true, category: 'lanthanide' },
  { atomicNumber: 62, symbol: 'Sm', name: 'Samarium', nameZh: '钐', atomicMass: '150.36', massIsBracketed: false, category: 'lanthanide' },
  { atomicNumber: 63, symbol: 'Eu', name: 'Europium', nameZh: '铕', atomicMass: '151.96', massIsBracketed: false, category: 'lanthanide' },
  { atomicNumber: 64, symbol: 'Gd', name: 'Gadolinium', nameZh: '钆', atomicMass: '157.25', massIsBracketed: false, category: 'lanthanide' },
  { atomicNumber: 65, symbol: 'Tb', name: 'Terbium', nameZh: '铽', atomicMass: '158.93', massIsBracketed: false, category: 'lanthanide' },
  { atomicNumber: 66, symbol: 'Dy', name: 'Dysprosium', nameZh: '镝', atomicMass: '162.50', massIsBracketed: false, category: 'lanthanide' },
  { atomicNumber: 67, symbol: 'Ho', name: 'Holmium', nameZh: '钬', atomicMass: '164.93', massIsBracketed: false, category: 'lanthanide' },
  { atomicNumber: 68, symbol: 'Er', name: 'Erbium', nameZh: '铒', atomicMass: '167.26', massIsBracketed: false, category: 'lanthanide' },
  { atomicNumber: 69, symbol: 'Tm', name: 'Thulium', nameZh: '铥', atomicMass: '168.93', massIsBracketed: false, category: 'lanthanide' },
  { atomicNumber: 70, symbol: 'Yb', name: 'Ytterbium', nameZh: '镱', atomicMass: '173.05', massIsBracketed: false, category: 'lanthanide' },
  { atomicNumber: 71, symbol: 'Lu', name: 'Lutetium', nameZh: '镥', atomicMass: '174.97', massIsBracketed: false, category: 'lanthanide' },
  { atomicNumber: 72, symbol: 'Hf', name: 'Hafnium', nameZh: '铪', atomicMass: '178.49', massIsBracketed: false, category: 'transition-metal' },
  { atomicNumber: 73, symbol: 'Ta', name: 'Tantalum', nameZh: '钽', atomicMass: '180.95', massIsBracketed: false, category: 'transition-metal' },
  { atomicNumber: 74, symbol: 'W', name: 'Tungsten', nameZh: '钨', atomicMass: '183.84', massIsBracketed: false, category: 'transition-metal' },
  { atomicNumber: 75, symbol: 'Re', name: 'Rhenium', nameZh: '铼', atomicMass: '186.21', massIsBracketed: false, category: 'transition-metal' },
  { atomicNumber: 76, symbol: 'Os', name: 'Osmium', nameZh: '锇', atomicMass: '190.23', massIsBracketed: false, category: 'transition-metal' },
  { atomicNumber: 77, symbol: 'Ir', name: 'Iridium', nameZh: '铱', atomicMass: '192.22', massIsBracketed: false, category: 'transition-metal' },
  { atomicNumber: 78, symbol: 'Pt', name: 'Platinum', nameZh: '铂', atomicMass: '195.08', massIsBracketed: false, category: 'transition-metal' },
  { atomicNumber: 79, symbol: 'Au', name: 'Gold', nameZh: '金', atomicMass: '196.97', massIsBracketed: false, category: 'transition-metal' },
  { atomicNumber: 80, symbol: 'Hg', name: 'Mercury', nameZh: '汞', atomicMass: '200.59', massIsBracketed: false, category: 'transition-metal' },
  { atomicNumber: 81, symbol: 'Tl', name: 'Thallium', nameZh: '铊', atomicMass: '204.38', massIsBracketed: false, category: 'post-transition-metal' },
  { atomicNumber: 82, symbol: 'Pb', name: 'Lead', nameZh: '铅', atomicMass: '207.2', massIsBracketed: false, category: 'post-transition-metal' },
  { atomicNumber: 83, symbol: 'Bi', name: 'Bismuth', nameZh: '铋', atomicMass: '208.98', massIsBracketed: false, category: 'post-transition-metal' },
  { atomicNumber: 84, symbol: 'Po', name: 'Polonium', nameZh: '钋', atomicMass: '[209]', massIsBracketed: true, category: 'metalloid' },
  { atomicNumber: 85, symbol: 'At', name: 'Astatine', nameZh: '砹', atomicMass: '[210]', massIsBracketed: true, category: 'halogen' },
  { atomicNumber: 86, symbol: 'Rn', name: 'Radon', nameZh: '氡', atomicMass: '[222]', massIsBracketed: true, category: 'noble-gas' },
  { atomicNumber: 87, symbol: 'Fr', name: 'Francium', nameZh: '钫', atomicMass: '[223]', massIsBracketed: true, category: 'alkali-metal' },
  { atomicNumber: 88, symbol: 'Ra', name: 'Radium', nameZh: '镭', atomicMass: '[226]', massIsBracketed: true, category: 'alkaline-earth-metal' },
  { atomicNumber: 89, symbol: 'Ac', name: 'Actinium', nameZh: '锕', atomicMass: '[227]', massIsBracketed: true, category: 'actinide' },
  { atomicNumber: 90, symbol: 'Th', name: 'Thorium', nameZh: '钍', atomicMass: '232.04', massIsBracketed: false, category: 'actinide' },
  { atomicNumber: 91, symbol: 'Pa', name: 'Protactinium', nameZh: '镤', atomicMass: '231.04', massIsBracketed: false, category: 'actinide' },
  { atomicNumber: 92, symbol: 'U', name: 'Uranium', nameZh: '铀', atomicMass: '238.03', massIsBracketed: false, category: 'actinide' },
  { atomicNumber: 93, symbol: 'Np', name: 'Neptunium', nameZh: '镎', atomicMass: '[237]', massIsBracketed: true, category: 'actinide' },
  { atomicNumber: 94, symbol: 'Pu', name: 'Plutonium', nameZh: '钚', atomicMass: '[244]', massIsBracketed: true, category: 'actinide' },
  { atomicNumber: 95, symbol: 'Am', name: 'Americium', nameZh: '镅', atomicMass: '[243]', massIsBracketed: true, category: 'actinide' },
  { atomicNumber: 96, symbol: 'Cm', name: 'Curium', nameZh: '锔', atomicMass: '[247]', massIsBracketed: true, category: 'actinide' },
  { atomicNumber: 97, symbol: 'Bk', name: 'Berkelium', nameZh: '锫', atomicMass: '[247]', massIsBracketed: true, category: 'actinide' },
  { atomicNumber: 98, symbol: 'Cf', name: 'Californium', nameZh: '锎', atomicMass: '[251]', massIsBracketed: true, category: 'actinide' },
  { atomicNumber: 99, symbol: 'Es', name: 'Einsteinium', nameZh: '锿', atomicMass: '[252]', massIsBracketed: true, category: 'actinide' },
  { atomicNumber: 100, symbol: 'Fm', name: 'Fermium', nameZh: '镄', atomicMass: '[257]', massIsBracketed: true, category: 'actinide' },
  { atomicNumber: 101, symbol: 'Md', name: 'Mendelevium', nameZh: '钔', atomicMass: '[258]', massIsBracketed: true, category: 'actinide' },
  { atomicNumber: 102, symbol: 'No', name: 'Nobelium', nameZh: '锘', atomicMass: '[259]', massIsBracketed: true, category: 'actinide' },
  { atomicNumber: 103, symbol: 'Lr', name: 'Lawrencium', nameZh: '铹', atomicMass: '[262]', massIsBracketed: true, category: 'actinide' },
  { atomicNumber: 104, symbol: 'Rf', name: 'Rutherfordium', nameZh: '𬬻', atomicMass: '[267]', massIsBracketed: true, category: 'transition-metal' },
  { atomicNumber: 105, symbol: 'Db', name: 'Dubnium', nameZh: '𬭊', atomicMass: '[268]', massIsBracketed: true, category: 'transition-metal' },
  { atomicNumber: 106, symbol: 'Sg', name: 'Seaborgium', nameZh: '𬭳', atomicMass: '[269]', massIsBracketed: true, category: 'transition-metal' },
  { atomicNumber: 107, symbol: 'Bh', name: 'Bohrium', nameZh: '𬭛', atomicMass: '[270]', massIsBracketed: true, category: 'transition-metal' },
  { atomicNumber: 108, symbol: 'Hs', name: 'Hassium', nameZh: '𬭶', atomicMass: '[269]', massIsBracketed: true, category: 'transition-metal' },
  { atomicNumber: 109, symbol: 'Mt', name: 'Meitnerium', nameZh: '䥑', atomicMass: '[277]', massIsBracketed: true, category: 'transition-metal' },
  { atomicNumber: 110, symbol: 'Ds', name: 'Darmstadtium', nameZh: '𫟼', atomicMass: '[281]', massIsBracketed: true, category: 'transition-metal' },
  { atomicNumber: 111, symbol: 'Rg', name: 'Roentgenium', nameZh: '𬬭', atomicMass: '[282]', massIsBracketed: true, category: 'transition-metal' },
  { atomicNumber: 112, symbol: 'Cn', name: 'Copernicium', nameZh: '鎶', atomicMass: '[285]', massIsBracketed: true, category: 'transition-metal' },
  { atomicNumber: 113, symbol: 'Nh', name: 'Nihonium', nameZh: '鉨', atomicMass: '[286]', massIsBracketed: true, category: 'post-transition-metal' },
  { atomicNumber: 114, symbol: 'Fl', name: 'Flerovium', nameZh: '鈇', atomicMass: '[290]', massIsBracketed: true, category: 'post-transition-metal' },
  { atomicNumber: 115, symbol: 'Mc', name: 'Moscovium', nameZh: '镆', atomicMass: '[290]', massIsBracketed: true, category: 'post-transition-metal' },
  { atomicNumber: 116, symbol: 'Lv', name: 'Livermorium', nameZh: '鉝', atomicMass: '[293]', massIsBracketed: true, category: 'post-transition-metal' },
  { atomicNumber: 117, symbol: 'Ts', name: 'Tennessine', nameZh: '鿬', atomicMass: '[294]', massIsBracketed: true, category: 'halogen' },
  { atomicNumber: 118, symbol: 'Og', name: 'Oganesson', nameZh: '鿫', atomicMass: '[294]', massIsBracketed: true, category: 'noble-gas' },
] as const satisfies readonly PeriodicElement[];

if (PERIODIC_ELEMENTS.length !== 118) {
  throw new Error(
    'Periodic element dataset must contain 118 elements. Received ' + PERIODIC_ELEMENTS.length + '.',
  );
}
