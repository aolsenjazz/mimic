import DrawerRightClosed from '@assets/drawer_right_closed.svg';
import DrawerRightOpen from '@assets/drawer_right_open.svg';
import DrawerLeftClosed from '@assets/drawer_left_closed.svg';
import DrawerLeftOpen from '@assets/drawer_left_open.svg';

type PropTypes = {
  showLeftDrawer: boolean;
  showRightDrawer: boolean;
  setShowLeftDrawer: (show: boolean) => void;
  setShowRightDrawer: (show: boolean) => void;
};

export default function DrawerToggles(props: PropTypes) {
  const {
    showLeftDrawer,
    showRightDrawer,
    setShowRightDrawer,
    setShowLeftDrawer,
  } = props;

  return (
    <div className="drawer-toggles">
      <img
        src={showLeftDrawer ? DrawerLeftOpen : DrawerLeftClosed}
        alt={showLeftDrawer ? 'show left drawer' : 'close left drawer'}
        onClick={() => setShowLeftDrawer(!showLeftDrawer)}
        height="18"
        role="presentation"
      />
      <img
        src={showRightDrawer ? DrawerRightOpen : DrawerRightClosed}
        alt={showRightDrawer ? 'show right drawer' : 'close right drawer'}
        height={18}
        onClick={() => setShowRightDrawer(!showRightDrawer)}
        role="presentation"
      />
    </div>
  );
}
