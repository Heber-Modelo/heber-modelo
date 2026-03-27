export default interface ICommand {
  execute(): Number;

  undo(): Number;
}
