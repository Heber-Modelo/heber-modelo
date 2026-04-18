import ICommand from "model/command/iCommand";

export default class CommandHistory {
  private _commands: ICommand[] = [];
  private _undoHistory: ICommand[] = [];

  public saveAndExecuteCommand(command: ICommand): void {
    this._commands.push(command);
    command.execute();
  }

  public redoLastCommand(): void {
    let lastCommand: ICommand | undefined = this._undoHistory.pop();

    if (lastCommand !== undefined) {
      lastCommand.redo();
      this._commands.push(lastCommand);
    }
  }

  public undoLastCommand(): void {
    let lastCommand: ICommand | undefined = this._commands.pop();

    if (lastCommand !== undefined) {
      lastCommand.undo();
      this._undoHistory.push(lastCommand);
    }
  }
}
