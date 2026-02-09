import ICommand from "../../model/command/iCommand.js";

class CommandHistory {
  private _commands: ICommand[] = [];

  public saveAndExecuteCommand(command: ICommand): void {
    this._commands.push(command);
    command.execute();
  }

  public undoLastCommand(): void {
    this._commands.pop()?.undo();
  }
}

export default CommandHistory;
