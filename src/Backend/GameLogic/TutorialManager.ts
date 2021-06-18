import { EventEmitter } from 'events';
import NotificationManager from '../../Frontend/Game/NotificationManager';
import { Setting, setBooleanSetting } from '../../Frontend/Utils/SettingsHooks';
import GameUIManager from './GameUIManager';

export enum TutorialManagerEvent {
  StateChanged = 'StateChanged',
}

export enum TutorialState {
  None,

  HomePlanet,
  SendFleet,
  Deselect,
  ZoomOut,
  MinerMove,
  MinerPause,
  Terminal,
  HowToGetScore,
  Valhalla,

  AlmostCompleted,
  Completed,
}

class TutorialManager extends EventEmitter {
  static instance: TutorialManager;
  private tutorialState: TutorialState = TutorialState.None;

  private constructor() {
    super();
  }

  static getInstance() {
    if (!TutorialManager.instance) {
      TutorialManager.instance = new TutorialManager();
    }

    return TutorialManager.instance;
  }

  private setTutorialState(newState: TutorialState) {
    this.tutorialState = newState;
    this.emit(TutorialManagerEvent.StateChanged, newState);

    if (newState === TutorialState.Completed) {
      const notifManager = NotificationManager.getInstance();
      notifManager.welcomePlayer();
    }
  }

  private advance() {
    this.setTutorialState(Math.min(this.tutorialState + 1, TutorialState.Completed));
  }

  reset() {
    this.setTutorialState(TutorialState.None);
  }

  complete(gameUiManager: GameUIManager) {
    this.setTutorialState(TutorialState.Completed);
    setBooleanSetting(gameUiManager.getAccount(), Setting.TutorialCompleted, true);
  }

  acceptInput(state: TutorialState) {
    if (state === this.tutorialState) this.advance();
  }
}

export default TutorialManager;
