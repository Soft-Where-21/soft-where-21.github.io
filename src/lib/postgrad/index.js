import {grade23Calculator} from './grade23.js';
import {grade24Calculator} from './grade24.js';

export const CALCULATORS = {
  '23': grade23Calculator,
  '24': grade24Calculator,
};

export const SUPPORTED_GRADES = Object.keys(CALCULATORS);

export function getCalculator(grade) {
  return CALCULATORS[grade] || grade23Calculator;
}
