
declare module "node-lifx" {
  import { AddressInfo } from "net";
  import { EventEmitter } from "eventemitter3";
  import { RemoteInfo, Socket } from "dgram";

  class Client extends EventEmitter {
    constructor();

    debug: boolean;
    socket: Socket;
    isSocketBound: boolean;
    devices: { [id: string]: Light };
    port: null | number;

    init(options?: InitOptions, callback?: () => void): void;
    destroy(): void;

    sendingProcess(): void;
    startSendingProcess(): void;
    stopSendingProcess(): void;

    startDiscovery(lights: string[]): void;
    stopDiscovery(): void;

    // processMessageHandlers(message: Message, remoteInfo: RemoteInfo): void;
    // processDiscoveryPacket(err?: Error, msg: Message, remoteInfo: RemoteInfo): void;
    // processLabelPacket(err?: Error, msg: Message): void;
    // send(msg: Message, callback?: () => void): number;

    address(): AddressInfo;

    setDebug(debug: boolean): void;

    addMessageHandler(type: PacketType, callback: () => void, sequenceNumber?: number): void;

    // I think this may not actually be the case when the status is empty string
    lights(status?: LightStatus): Light[];
    lights(status: ''): { [id: string]: Light };
    light(identifier: string): Light | false;

    on(event: 'error', fn: (err: Error) => void, context?: any): this;
    on(event: 'message', fn: (msg: Packet, remoteInfo: RemoteInfo) => void, context?: any): this;
    on(event: 'listening', fn: () => void, context?: any): this;
    on(event: 'light-offline', fn: (light: Light) => void, context?: any): this;
    on(event: 'light-new', fn: (light: Light) => void, context?: any): this;
    on(event: 'light-online', fn: (light: Light) => void, context?: any): this;
  }

  class Light {
    constructor(constr: { client: Client, id: string, address: string, port: number, seenOnDiscovery: number });

    client: Client;
    id: string;
    address: string;
    port: number;
    label: null | string;
    status: LightStatus;
    seenOnDiscovery: number;

    off(duration?: number, callback?: () => void): void;
    on(duration?: number, callback?: () => void): void;
    color(hue: number, saturation: number, brightness: number, kelvin?: number, duration?: number, callback?: () => void): void;
    colorRgb(red: number, green: number, blue: number, duration?: number, callback?: () => void): void;
    colorRgbHex(hexString: string, duration?: number, callback?: () => void): void;
    maxIR(brightness: number, callback?: () => void): void;
    getState(callback?: (state: { color: { hue: number, saturation: number, brightness: number }, power: number, label: string }) => void): void;
    getMaxIR(callback?: (maxIR: number) => void): void;

    getHardwareVersion(callback: (err?: Error, hardwareVersion?: { vendorName?: string, productName?: string; productFeatures?: { [key:string]: boolean }, vendorId: number, productId: number, version: number }) => void): void;
    getFirmwareVersion(callback: (err?: Error, firmwareVersion?: { majorVersion: number, minorVersion: number }) => void): void;
    getFirmwareInfo(callback: (err?: Error, firmwareInfo?: { signal: number, tx: number, rx: number }) => void): void;
    getWifiInfo(callback: (err?: Error, wifiInfo?: { signal: number, tx: number, rx: number }) => void): void;
    getWifiVersion(callback: (err?: Error, wifiVersion?: { majorVersion: number, minorVersion: number }) => void): void;
    getLabel(callback: (err?: Error, label?: string) => void, cache?: boolean): void;
    setLabel(label: string, callback: () => void): void;
    getAmbientLight(callback: (err?: Error, ambientLight?: number) => void): void;
    getPower(callback: (err?: Error, power?: number) => void): void;
  }
}

interface InitOptions {
  address?: string;
  port?: number;
  debug?: boolean;
  lightOfflineTolerance?: number;
  messageHandlerTimeout?: number;
  source?: string;
  startDiscovery?: boolean;
  lights?: string[];
  broadcast?: string;
  resendPacketDelay?: number;
  resendMaxTimes?: number;
}

// TODO
interface Packet {

}

type LightStatus = 'on' | 'off';
type PacketType = 'getService' | 'stateService' | 'getHostInfo' | 'stateHostInfo' | 'getHostFirmware' | 'stateHostFirmware' | 'getWifiInfo' | 'stateWifiInfo' | 'getWifiFirmware' | 'stateWifiFirmware' | 'getLabel' | 'setLabel' | 'stateLabel' | 'getVersion' | 'stateVersion' | 'acknowledgement' | 'getLocation' | 'stateLocation' | 'getGroup' | 'stateGroup' | 'getOwner' | 'stateOwner' | 'echoRequest' | 'echoResponse' | 'getTemperature' | 'stateTemperature' | 'getLight' | 'setColor' | 'setWaveform' | 'stateLight' | 'stateTemperature' | 'getPower' | 'setPower' | 'statePower' | 'getInfrared' | 'stateInfrared' | 'setInfrared' | 'getAmbientLight' | 'stateAmbientLight';