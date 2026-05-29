import {
  Camera,
  ShieldCheck,
  Home,
  CircleUserRound,
  Network,
} from 'lucide-react';

import logo from './assets/mortech-logo-cropped.png';
import ramMemoryImage from './assets/products/Memoire RAM DDR4 8GB 3200MHz.jpg';
import sandiskSsdImage from './assets/products/SSD SATA 480GB pour ordinateur portable.webp';
import portableDriveImage from './assets/products/Disque dur portable externe 2TB USB 3.0.webp';
import wdHddImage from './assets/products/Disque dur HDD 1TB SATA 3.5 pouces.webp';
import hikvisionTurboPtzImage from './assets/products/Hikvision Turbo HD PTZ SD2A500HB-GN-AW-PV-S2.webp';
import hikvisionWifiRangerImage from './assets/products/Hikvision Camera IP Wi-Fi Ranger.jpg';
import hikvisionBulletImage from './assets/products/Camera IP Hikvision Bullet 4MP Lite Full-color.webp';
import cameraAnalogImage from './assets/products/Camera Analogique 5MP IR 40m Bullet DS-2CE10KF0T-LFS.webp';
import dvrImage from './assets/products/DVR 2MP 4 channel DS-7204HGHI-M1.webp';
import nvrImage from './assets/products/NVR Hikvision 8 canaux PoE pour camera IP.webp';
import videophoneImage from './assets/products/DS-KIS212-4-Wire-HD-Video-Intercom-Kit-Hikvision-1-min.webp';
import dahuaBulletImage from './assets/products/Dahua Camera IP Bullet 4MP PoE Full-color Network.webp';
import dahuaDomeImage from './assets/products/Dahua Camera IP Dome 2MP Wide View Night Vision.webp';
import dahuaNvrImage from './assets/products/Dahua NVR 8 canaux PoE Resolution 4MP.png';
import dahuaXvrImage from './assets/products/Dahua XVR 4MP 8 canaux DVR-NVR Hybride.webp';
import dahuaVideophoneImage from './assets/products/Dahua Videophone IP 7 pouces Ecran Tactile.webp';
import dahuacameraAnalogImage from './assets/products/Dahua Camera Analogique 5MP Turret IR 40m.jpg';
import Armoireinformatiqueetanche from './assets/products/Armoire informatique etanche murale 12U IP65.webp';
import Armoireinformatique from './assets/products/Armoire informatique reseau 19 pouces 9U.jpg';
import Plateaufixe from './assets/products/Plateau fixe et multiprise pour armoire reseau.webp';
import switchTpLinkImage from './assets/products/Switch TP-Link Gigabit 8 ports metal.jpeg';
import switchPoeImage from './assets/products/Switch PoE 8 ports pour cameras IP.webp';
import switch8PortImage from './assets/products/Switch reseau 8 ports Gigabit non manageable.png';
import switch16PortImage from './assets/products/Switch 16 ports Gigabit rackable.webp';
import switch24PortImage from './assets/products/Switch 24 port.jpeg';
import somfyTahomaImage from './assets/products/Box domotique Somfy TaHoma Switch.jpg';
import tuyaSwitchImage from './assets/products/Interrupteur intelligent Tuya Wi-Fi tactile.webp';
import shellyRelayImage from './assets/products/Module relais Shelly Plus 1 Wi-Fi.png';
import akuvoxMonitorImage from './assets/products/Moniteur interieur Akuvox pour maison connectee.jpg';
import sonoffModuleImage from './assets/products/Sonoff 4CH Pro R3 module domotique.webp';
import hikvisionAccessControlImage from './assets/products/hikvision-access-control-ds-k1t804amf-terminal-de-controle-d-acces-presence-avec-ecran-et-clavier.jpg';
import smartLockImage from './assets/products/Serrure intelligente connectee avec clavier et badge.webp';
import pointeuseHikvisionImage from './assets/products/Pointeuse Hikvision biometrie visage et badge.webp';
import pointeuseZktecoImage from './assets/products/Pointeuse ZKTeco biometrie empreinte et badge.jpeg';
import kitAlarmeAjaxImage from './assets/products/Kit alarme Ajax Hub avec detecteur mouvemen.webp';
import detecteurIntrusionHikvisionImage from './assets/products/Detecteur intrusion Hikvision sans fil PIR.webp';
import cableAlarmeImage from './assets/products/Cable alarme 6 conducteurs pour systeme intrusion.jpeg';
import alarmeAutonomeImage from './assets/products/Alarme autonome avec sirene integree et detecteur.webp';
import kitAlarmeDahuaImage from './assets/products/Kit alarme Dahua sans fil avec sirene et detecteur.webp';
import cableIncendieImage from './assets/products/Cable incendie CR1 rouge 2 conducteurs.jpeg';

export const categoryGroups = [
  {
    name: 'Materiel Informatique',
    sections: [
      { name: 'Stockage', links: ['HDD', 'Cartes memoire', 'Stockage portable', 'SSDs', 'RAM'] },
    ],
  },
  {
    name: 'Videosurveillance',
    sections: [
      { name: 'Hikvision', links: ['Camera Analog Hikvision', 'Camera IP Hikvision', 'DVR Hikvision', 'NVR Hikvision', 'Videophone Hikvision'] },
      { name: 'Dahua', links: ['Camera Analog Dahua', 'Camera IP Dahua', 'XVR Dahua', 'NVR Dahua', 'Videophone Dahua'] },
    ],
  },
  {
    name: 'Equipement Reseaux',
    sections: [
      { name: 'Armoire', links: ['Armoire Informatique Etanche', 'Armoire Informatique', "Accessoires d'Armoire"] },
      { name: 'Switch', links: ['Switch TP-Link', 'Switch PoE', 'Switch 8 port', 'Switch 16 port', 'Switch 24 port'] },
    ],
  },
  {
    name: 'Domotique',
    sections: [
      { name: 'Domotique', links: ['TAHOMA SOMFY', 'AKUVOX', 'Tuya', 'Sonoff', 'Shelly'] },
    ],
  },
  {
    name: 'Controle Dacces et Pointeuse',
    sections: [
      { name: "Controle D'acces", links: ["Controle d'acces hikvision", 'Serrure intelligente', "Controle D'acces ZKTeco", "Controle D'acces Dahua"] },
      { name: 'Pointeuse', links: ['Pointeuse hikvision', 'Pointeuse ZKTeco'] },
    ],
  },
  {
    name: 'Securite',
    sections: [
      { name: 'Detection intrusion', links: ['Cable alarm', 'Alarme Ajax', 'ALARME HIKVISION', 'Alarme Autonome', 'Alarme Dahua'] },
      { name: 'Detection incendie', links: ['Cable incendie', 'Incendie Nugelec', 'Incendie Adressable', 'Incendie conventionnelle', 'Alarme incendie'] },
    ],
  },
];

export const quickCategories = [
  ['Uniview Camera', 'Camera IP et NVR professionnels', Camera, 'Videosurveillance'],
  ['Hikvision Camera', 'Surveillance analogique et IP', ShieldCheck, 'Videosurveillance'],
  ['Domotique Sonoff', 'Modules connectes et capteurs', Home, 'Domotique'],
  ['Pointage ZKTeco', 'Pointeuses et controle acces', CircleUserRound, 'Controle Dacces et Pointeuse'],
  ['Ruijie sans fil', 'Wi-Fi entreprise et mesh', Network, 'Equipement Reseaux'],
];

export const dynamicHeroWords = ['Videosurveillance', 'Reseaux', 'Domotique', 'Controle acces', 'Informatique'];
