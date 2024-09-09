import { difficulty } from '../../storage/puzzle-storage';

export class ChangeDifficultyEvent extends Event {
  static event = 'change-difficulty';

  public difficulty: difficulty;
  constructor(difficulty: difficulty) {
    super(ChangeDifficultyEvent.event, { bubbles: true, composed: true });
    this.difficulty = difficulty;
  }
}
