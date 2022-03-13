import _ = require('lodash');
import { Hero } from './types';
import SuperheroRepository from './superheroRepository';

export default class SuperheroService {
  constructor(private readonly superheroRepository: SuperheroRepository) {}

  public async current(): Promise<Hero[]> {
    let currentSelection = await this.superheroRepository.fetchCurrentHeroes();

    if (currentSelection.length === 0) {
      currentSelection = await this.pick();
    }

    return currentSelection;
  }

  public async pick(): Promise<Hero[]> {
    const { numberOfHeroes } = await this.superheroRepository.fetchConfiguration();
    const availableMembers = await this.superheroRepository.fetchAvailableMembers();

    if (availableMembers.length === 0) {
      throw new Error('List of members is empty');
    }

    const newSelection: Array<Hero> = _.sampleSize(
      availableMembers,
      numberOfHeroes
    );

    await this.superheroRepository.removeCurrentHeroes();
    await this.superheroRepository.saveNewHeroes(newSelection);

    return newSelection;
  }

  public async setup(members: Hero[], numberOfHeroes: number): Promise<unknown> {
    if (members.length === 0) {
      throw new Error(`List of members can't be empty`);
    }

    return Promise.all([
      this.superheroRepository.saveConfiguration(numberOfHeroes),
      this.superheroRepository.saveMembers(members)
    ]);
  }
}
