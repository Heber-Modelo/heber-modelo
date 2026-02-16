interface ICommand {
  execute(): Number;

  undo(): Number;
}

export default ICommand;
