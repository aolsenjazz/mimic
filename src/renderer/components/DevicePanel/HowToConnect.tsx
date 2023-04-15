import Svg from '@assets/how_to_connect.svg';

export default function HowToConnect() {
  return (
    <div id="how-to-connect">
      <p>Emulate a new device using the Add menu:</p>
      <img
        src={Svg}
        alt="connect by selecting New, then selecting the device which you would like to connect"
      />
    </div>
  );
}
