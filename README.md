<!-- DOWNLOAD INTEL -->

<!-- END DOWNLOAD INTEL -->
<!-- DOWNLOAD SILICON -->

<!-- END DOWNLOAD SILICON -->
<div align="center">
  <img width="200px" align="center"  src="https://user-images.githubusercontent.com/13665641/230733724-562d0b97-301f-4c86-bbfd-5cb7e85f9253.png" />
</div>
<h1 align="center">Mimic</h1>
<h3 align="center">Emulate popular MIDI devices for testing software and DAW configurations</h3>
<!--<div align="center" style="margin-bottom: 200px;">
  <img src="https://img.shields.io/github/workflow/status/aolsenjazz/super-controller/Test"/>
  <img src="https://img.shields.io/github/license/aolsenjazz/super-controller"/>
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square"/>
</div>-->

- 🖥️ **Support** Mac OSX 10.11+ Intel/Silicon
- 🎹 **Popular Devices** 20+ devices from multiple manufacturers
- ⏩ **Low Latency**: < 1 ms latency

Mimic is an [electron](https://www.electronjs.org/) application boostrapped with [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate). It is designed with the purpose of simplying software testing for MIDI-centric applications, though it can fit plenty of use cases outside of this.

## Device Support

Mimic repurposes the driver files created by and for [SuperController](https://www.github.com/aolsenjazz/super-controller). If a device is supported, it will have a driver file there. Supporting more devices makes this software more useful for everyone so if you are able to write drivers for your devices, please do so! If not, please [open a pull request](https://github.com/aolsenjazz/mimic/pulls) and we'll work together to get your device supported.

## Build + run locally

```shell
git clone https://github.com/aolsenjazz/mimic
cd mimic
npm run post-clone
npm start
```

## Tests

After install and running post-clone:

```shell
npm run build
npm test
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

License available in `LICENSE.txt`.
