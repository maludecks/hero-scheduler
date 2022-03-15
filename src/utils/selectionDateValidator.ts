import * as moment from 'moment';
import { Hero } from '../services/types';

export default class SelectionDateValidator {
  public isValid(heroes: Hero[]): boolean {
    const selectionValidity: Array<boolean> = heroes.map(
      hero => moment(hero.lastSelected).isSame(moment(), 'day')
    );

    return !selectionValidity.includes(false);
  }
}
