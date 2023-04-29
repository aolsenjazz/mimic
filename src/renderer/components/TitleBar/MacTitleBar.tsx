import DrawerToggles from './DrawerToggles';

type PropTypes = {
  showLeftDrawer: boolean;
  showRightDrawer: boolean;
  setShowLeftDrawer: (show: boolean) => void;
  setShowRightDrawer: (show: boolean) => void;
};

/**
 * On mac, stoplight controls are overlaid over this draggable title bar
 */
export default function TitleBar(props: PropTypes) {
  const {
    showLeftDrawer,
    showRightDrawer,
    setShowRightDrawer,
    setShowLeftDrawer,
  } = props;

  return (
    <>
      <div id="title-bar">
        <div id="drag-region">
          <div id="no-shadow" />
          <h1 id="title">Mimic</h1>
          <div id="shadow" />
        </div>
        <DrawerToggles
          showLeftDrawer={showLeftDrawer}
          showRightDrawer={showRightDrawer}
          setShowLeftDrawer={setShowLeftDrawer}
          setShowRightDrawer={setShowRightDrawer}
        />
      </div>
    </>
  );
}
