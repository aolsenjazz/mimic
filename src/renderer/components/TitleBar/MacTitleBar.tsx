/**
 * On mac, stoplight controls are overlaid over this draggable title bar
 */
export default function TitleBar() {
  return (
    <div id="title-bar">
      <div id="no-shadow" />
      <h1 id="title">Mimic</h1>
      <div id="shadow" />
    </div>
  );
}
