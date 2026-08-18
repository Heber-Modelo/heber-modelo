export type CommandResult = {
  ok: boolean;
  error: string | undefined;
};

export default interface ICommand {
  execute(): CommandResult;

  redo(): CommandResult;

  undo(): CommandResult;
}
