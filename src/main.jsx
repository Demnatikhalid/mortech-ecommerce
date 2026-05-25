import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AlarmSmoke,
  Building2,
  Camera,
  Check,
  ChevronDown,
  CircleUserRound,
  Cpu,
  CreditCard,
  Headphones,
  Home,
  Mail,
  MapPin,
  Menu,
  Minus,
  Network,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  Truck,
  UserPlus,
  X,
  Zap,
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
import './styles.css';

const categoryGroups = [
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

const products = [
  {
    id: 1,
    brand: 'Dahua',
    category: 'Videosurveillance',
    subcategory: 'Camera IP Dahua',
    name: 'Dahua Camera IP Bullet 4MP PoE Full-color Network',
    price: 680,
    badge: '4MP PoE',
    image: dahuaBulletImage,
    stock: true,
  },
  {
    id: 3,
    brand: 'Dahua',
    category: 'Videosurveillance',
    subcategory: 'Camera IP Dahua',
    name: 'Dahua Camera IP Dome 2MP Wide View Night Vision',
    price: 520,
    badge: '2MP Dome',
    image: dahuaDomeImage,
    stock: true,
  },
  {
    id: 4,
    brand: 'Dahua',
    category: 'Videosurveillance',
    subcategory: 'Camera Analog Dahua',
    name: 'Dahua Camera Analogique 5MP Turret IR 40m',
    price: 450,
    badge: 'IR 40m',
    image: dahuacameraAnalogImage,
    stock: true,
  },
  {
    id: 5,
    brand: 'Hikvision',
    category: 'Videosurveillance',
    subcategory: 'Camera IP Hikvision',
    name: 'Hikvision Turbo HD PTZ SD2A500HB-GN-AW-PV-S2',
    price: 6000,
    badge: 'PTZ Wi-Fi',
    image: hikvisionTurboPtzImage,
    stock: true,
  },
  {
    id: 9,
    brand: 'Hikvision',
    category: 'Videosurveillance',
    subcategory: 'Camera IP Hikvision',
    name: 'Hikvision Camera IP Wi-Fi Ranger 2 IPC-A22EP-G',
    price: 384,
    badge: 'Best seller',
    image: hikvisionWifiRangerImage,
    stock: true,
  },
  {
    id: 21,
    brand: 'Hikvision',
    category: 'Videosurveillance',
    subcategory: 'Camera IP Hikvision',
    name: 'Camera IP Hikvision Bullet 4MP Lite Full-color',
    price: 624,
    badge: '4MP',
    image: hikvisionBulletImage,
    stock: true,
  },
  {
    id: 22,
    brand: 'Hikvision',
    category: 'Videosurveillance',
    subcategory: 'Camera Analog Hikvision',
    name: 'Camera Analogique 5MP IR 40m Bullet DS-2CE10KF0T-LFS',
    price: 420,
    badge: 'IR 40m',
    image: cameraAnalogImage,
    stock: true,
  },
  {
    id: 23,
    brand: 'Hikvision',
    category: 'Videosurveillance',
    subcategory: 'DVR Hikvision',
    name: 'DVR 2MP 4 channel DS-7204HGHI-M1',
    price: 546,
    badge: 'DVR',
    image: dvrImage,
    stock: false,
  },
  {
    id: 6,
    brand: 'Ruijie Reyee',
    category: 'Equipement Reseaux',
    name: 'Point acces exterieur RG-RAP6202(G) Wi-Fi 5 AC1300',
    price: 1625,
    badge: 'Outdoor',
    image: 'https://disismaroc.com/storage/products/16/381/disismaroc-point-dacces-exterieur-omnidirectionnel-rg-rap6202g-wi-fi-5-ac1300--1724167262-6802.png',
    stock: true,
  },
  {
    id: 7,
    brand: 'Ruijie Reyee',
    category: 'Equipement Reseaux',
    name: 'Routeur Mesh Wi-Fi 6 3200M dual band Gigabit',
    price: 1513.2,
    badge: 'Wi-Fi 6',
    image: 'https://disismaroc.com/storage/products/16/385/disismaroc-routeur-mesh-wi-fi-6-3200m-dual-band-gigabit-rg-ew3200gx-pro--1724168243-2597.png',
    stock: true,
  },
  {
    id: 8,
    brand: 'Sonoff',
    category: 'Domotique',
    subcategory: 'Sonoff',
    name: 'Sonoff 4CH Pro R3 module domotique',
    price: 395,
    badge: 'Smart home',
    image: sonoffModuleImage,
    stock: true,
  },
  {
    id: 10,
    brand: 'Dahua',
    category: 'Videosurveillance',
    subcategory: 'NVR Dahua',
    name: 'Dahua NVR 8 canaux PoE Resolution 4MP',
    price: 1380,
    badge: 'NVR 8CH PoE',
    image: dahuaNvrImage,
    stock: true,
  },
  {
    id: 24,
    brand: 'Hikvision',
    category: 'Videosurveillance',
    subcategory: 'NVR Hikvision',
    name: 'NVR Hikvision 8 canaux PoE pour camera IP',
    price: 1250,
    badge: 'NVR PoE',
    image: nvrImage,
    stock: true,
  },
  {
    id: 25,
    brand: 'Dahua',
    category: 'Videosurveillance',
    subcategory: 'XVR Dahua',
    name: 'Dahua XVR 4MP 8 canaux DVR/NVR Hybride',
    price: 890,
    badge: 'Hybride 8CH',
    image: dahuaXvrImage,
    stock: true,
  },
  {
    id: 26,
    brand: 'Hikvision',
    category: 'Videosurveillance',
    subcategory: 'Videophone Hikvision',
    name: 'Videophone IP ecran tactile 7 pouces avec interphone',
    price: 1850,
    badge: 'Videophone',
    image: videophoneImage,
    stock: true,
  },
  {
    id: 27,
    brand: 'Dahua',
    category: 'Videosurveillance',
    subcategory: 'Videophone Dahua',
    name: 'Dahua Videophone IP 7 pouces Ecran Tactile',
    price: 2150,
    badge: 'Videophone 7"',
    image: dahuaVideophoneImage,
    stock: true,
  },
  {
    id: 28,
    brand: 'ZKTeco',
    category: 'Controle Dacces et Pointeuse',
    subcategory: 'Pointeuse ZKTeco',
    name: 'Pointeuse ZKTeco biometrie empreinte et badge',
    price: 1450,
    badge: 'Pointage',
    image: pointeuseZktecoImage,
    stock: true,
  },
  {
    id: 29,
    brand: 'Hikvision',
    category: 'Controle Dacces et Pointeuse',
    subcategory: "Controle d'acces hikvision",
    name: "Terminal controle d'acces Hikvision badge RFID",
    price: 1180,
    badge: 'RFID',
    image: hikvisionAccessControlImage,
    stock: true,
  },
  {
    id: 30,
    brand: 'Dahua',
    category: 'Controle Dacces et Pointeuse',
    subcategory: "Controle D'acces Dahua",
    name: "Kit controle d'acces Dahua avec lecteur et alimentation",
    price: 980,
    badge: 'Kit acces',
    image: 'https://www.dynamic-computers.rs/images/products/big/134163.jpg',
    stock: true,
  },
  {
    id: 31,
    brand: 'Ajax',
    category: 'Securite',
    subcategory: 'Alarme Ajax',
    name: 'Kit alarme Ajax Hub avec detecteur mouvement',
    price: 2890,
    badge: 'Alarme',
    image: kitAlarmeAjaxImage,
    stock: true,
  },
  {
    id: 32,
    brand: 'Hikvision',
    category: 'Securite',
    subcategory: 'ALARME HIKVISION',
    name: 'Detecteur intrusion Hikvision sans fil PIR',
    price: 390,
    badge: 'Intrusion',
    image: detecteurIntrusionHikvisionImage,
    stock: true,
  },
  {
    id: 33,
    brand: 'Nugelec',
    category: 'Securite',
    subcategory: 'Incendie Nugelec',
    name: 'Detecteur incendie conventionnel avec sirene',
    price: 320,
    badge: 'Incendie',
    image: 'https://materiel-securite-incendie.fireless.fr/5740-large_default/detecteur-thermovelocimetrique-s3000-nug30247.jpg',
    stock: true,
  },
  {
    id: 34,
    brand: 'Alarm Cable',
    category: 'Securite',
    subcategory: 'Cable alarm',
    name: 'Cable alarme 6 conducteurs pour systeme intrusion',
    price: 180,
    badge: 'Cable alarm',
    image: cableAlarmeImage,
    stock: true,
  },
  {
    id: 35,
    brand: 'Dahua',
    category: 'Securite',
    subcategory: 'Alarme Dahua',
    name: 'Kit alarme Dahua sans fil avec sirene et detecteur',
    price: 1690,
    badge: 'Dahua',
    image: kitAlarmeDahuaImage,
    stock: true,
  },
  {
    id: 36,
    brand: 'Autonome',
    category: 'Securite',
    subcategory: 'Alarme Autonome',
    name: 'Alarme autonome avec sirene integree et detecteur',
    price: 590,
    badge: 'Autonome',
    image: alarmeAutonomeImage,
    stock: true,
  },
  {
    id: 37,
    brand: 'Fire Cable',
    category: 'Securite',
    subcategory: 'Cable incendie',
    name: 'Cable incendie CR1 rouge 2 conducteurs',
    price: 220,
    badge: 'Cable feu',
    image: cableIncendieImage,
    stock: true,
  },
  {
    id: 38,
    brand: 'Nugelec',
    category: 'Securite',
    subcategory: 'Incendie Adressable',
    name: 'Detecteur incendie adressable optique pour boucle SSI',
    price: 520,
    badge: 'Adressable',
    image: 'https://materiel-securite-incendie.fireless.fr/5740-large_default/detecteur-thermovelocimetrique-s3000-nug30247.jpg',
    stock: true,
  },
  {
    id: 39,
    brand: 'Nugelec',
    category: 'Securite',
    subcategory: 'Incendie conventionnelle',
    name: 'Detecteur incendie conventionnel optique avec base',
    price: 290,
    badge: 'Conventionnel',
    image: 'https://materiel-securite-incendie.fireless.fr/5740-large_default/detecteur-thermovelocimetrique-s3000-nug30247.jpg',
    stock: true,
  },
  {
    id: 40,
    brand: 'Securite Incendie',
    category: 'Securite',
    subcategory: 'Alarme incendie',
    name: 'Kit alarme incendie avec declencheur manuel et sirene',
    price: 1150,
    badge: 'Alarme feu',
    image: 'https://materiel-securite-incendie.fireless.fr/5740-large_default/detecteur-thermovelocimetrique-s3000-nug30247.jpg',
    stock: true,
  },
  {
    id: 45,
    brand: 'Linkbasic',
    category: 'Equipement Reseaux',
    subcategory: 'Armoire Informatique Etanche',
    name: 'Armoire informatique etanche murale 12U IP65',
    price: 2450,
    badge: 'IP65',
    image: Armoireinformatiqueetanche,
    stock: true,
  },
  {
    id: 46,
    brand: 'Digitus',
    category: 'Equipement Reseaux',
    subcategory: 'Armoire Informatique',
    name: 'Armoire informatique reseau 19 pouces 9U',
    price: 1550,
    badge: '19 pouces',
    image: Armoireinformatique,
    stock: true,
  },
  {
    id: 47,
    brand: 'Mortech',
    category: 'Equipement Reseaux',
    subcategory: "Accessoires d'Armoire",
    name: 'Plateau fixe et multiprise pour armoire reseau',
    price: 320,
    badge: 'Accessoire',
    image: Plateaufixe,
    stock: true,
  },
  {
    id: 48,
    brand: 'TP-Link',
    category: 'Equipement Reseaux',
    subcategory: 'Switch TP-Link',
    name: 'Switch TP-Link Gigabit 8 ports metal',
    price: 290,
    badge: 'TP-Link',
    image: switchTpLinkImage,
    stock: true,
  },
  {
    id: 49,
    brand: 'Ruijie Reyee',
    category: 'Equipement Reseaux',
    subcategory: 'Switch PoE',
    name: 'Switch PoE 8 ports pour cameras IP',
    price: 890,
    badge: 'PoE',
    image: switchPoeImage,
    stock: true,
  },
  {
    id: 50,
    brand: 'D-Link',
    category: 'Equipement Reseaux',
    subcategory: 'Switch 8 port',
    name: 'Switch reseau 8 ports Gigabit non manageable',
    price: 260,
    badge: '8 ports',
    image: switch8PortImage,
    stock: true,
  },
  {
    id: 51,
    brand: 'TP-Link',
    category: 'Equipement Reseaux',
    subcategory: 'Switch 16 port',
    name: 'Switch 16 ports Gigabit rackable',
    price: 760,
    badge: '16 ports',
    image: switch16PortImage,
    stock: true,
  },
  {
    id: 52,
    brand: 'Cisco',
    category: 'Equipement Reseaux',
    subcategory: 'Switch 24 port',
    name: 'Switch 24 ports Gigabit pour baie reseau',
    price: 1450,
    badge: '24 ports',
    image: switch24PortImage,
    stock: true,
  },
  {
    id: 53,
    brand: 'Somfy',
    category: 'Domotique',
    subcategory: 'TAHOMA SOMFY',
    name: 'Box domotique Somfy TaHoma Switch',
    price: 1890,
    badge: 'TaHoma',
    image: somfyTahomaImage,
    stock: true,
  },
  {
    id: 54,
    brand: 'Akuvox',
    category: 'Domotique',
    subcategory: 'AKUVOX',
    name: 'Moniteur interieur Akuvox pour maison connectee',
    price: 2450,
    badge: 'Akuvox',
    image: akuvoxMonitorImage,
    stock: true,
  },
  {
    id: 55,
    brand: 'Tuya',
    category: 'Domotique',
    subcategory: 'Tuya',
    name: 'Interrupteur intelligent Tuya Wi-Fi tactile',
    price: 180,
    badge: 'Tuya',
    image: tuyaSwitchImage,
    stock: true,
  },
  {
    id: 56,
    brand: 'Shelly',
    category: 'Domotique',
    subcategory: 'Shelly',
    name: 'Module relais Shelly Plus 1 Wi-Fi',
    price: 210,
    badge: 'Shelly',
    image: shellyRelayImage,
    stock: true,
  },
  {
    id: 62,
    brand: 'Mortech',
    category: 'Controle Dacces et Pointeuse',
    subcategory: 'Serrure intelligente',
    name: 'Serrure intelligente connectee avec clavier et badge',
    price: 1450,
    badge: 'Smart lock',
    image: smartLockImage,
    stock: true,
  },
  {
    id: 63,
    brand: 'ZKTeco',
    category: 'Controle Dacces et Pointeuse',
    subcategory: "Controle D'acces ZKTeco",
    name: "Controle d'acces ZKTeco autonome empreinte et RFID",
    price: 1280,
    badge: 'ZKTeco',
    image: 'https://zkteco.technology/wp-content/uploads/2022/01/c00444fc2e4cb4d4f513af79ca6e1fe3.png',
    stock: true,
  },
  {
    id: 64,
    brand: 'Hikvision',
    category: 'Controle Dacces et Pointeuse',
    subcategory: 'Pointeuse hikvision',
    name: 'Pointeuse Hikvision biometrie visage et badge',
    price: 1750,
    badge: 'Pointage',
    image: pointeuseHikvisionImage,
    stock: true,
  },
  {
    id: 65,
    brand: 'Hikvision',
    category: 'Securite',
    subcategory: 'Detection intrusion',
    name: 'Pack detection intrusion avec centrale, detecteur et sirene',
    price: 2190,
    badge: 'Intrusion',
    image: 'https://www.ctccommunications.com.au/cdn/shop/products/Hikvison-Wireless-PIR-Detector-DS-PDP15P-EG2-WB_1_ba917418-9201-478e-973f-3447445c2683_600x600.jpg?v=1752449306',
    stock: true,
  },
  {
    id: 66,
    brand: 'Nugelec',
    category: 'Securite',
    subcategory: 'Detection incendie',
    name: 'Pack detection incendie avec detecteur, declencheur et sirene',
    price: 1380,
    badge: 'Incendie',
    image: 'https://materiel-securite-incendie.fireless.fr/5740-large_default/detecteur-thermovelocimetrique-s3000-nug30247.jpg',
    stock: true,
  },
  {
    id: 67,
    brand: 'Kingston',
    category: 'Materiel Informatique',
    subcategory: 'RAM',
    name: 'RAM Kingston 16GB DDR4 3200MHz UDIMM',
    price: 450,
    badge: 'DDR4 16GB',
    image: ramMemoryImage,
    stock: true,
  },
  {
    id: 68,
    brand: 'SanDisk',
    category: 'Materiel Informatique',
    subcategory: 'SSDs',
    name: 'SanDisk SSD Plus 1TB SATA III',
    price: 1200,
    badge: 'SSD 1TB',
    image: sandiskSsdImage,
    stock: true,
  },
  {
    id: 69,
    brand: 'WD',
    category: 'Materiel Informatique',
    subcategory: 'Stockage portable',
    name: 'WD My Passport Disque dur externe portable 2TB',
    price: 1050,
    badge: 'Portable 2TB',
    image: portableDriveImage,
    stock: true,
  },
  {
    id: 70,
    brand: 'WD',
    category: 'Materiel Informatique',
    subcategory: 'HDD',
    name: 'WD Blue Disque dur interne 1TB 3.5 pouces',
    price: 680,
    badge: 'HDD 1TB',
    image: wdHddImage,
    stock: true,
  },
];

const quickCategories = [
  ['Uniview Camera', 'Camera IP et NVR professionnels', Camera, 'Videosurveillance'],
  ['Hikvision Camera', 'Surveillance analogique et IP', ShieldCheck, 'Videosurveillance'],
  ['Domotique Sonoff', 'Modules connectes et capteurs', Home, 'Domotique'],
  ['Pointage ZKTeco', 'Pointeuses et controle acces', CircleUserRound, 'Controle Dacces et Pointeuse'],
  ['Ruijie sans fil', 'Wi-Fi entreprise et mesh', Network, 'Equipement Reseaux'],
];

const dynamicHeroWords = ['Videosurveillance', 'Reseaux', 'Domotique', 'Controle acces', 'Informatique'];

function formatPrice(value) {
  return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(value);
}

function buildWhatsAppOrder(cart, total) {
  const lines = cart.length
    ? cart.map((item) => `- ${item.name} x${item.qty} = ${formatPrice(item.price * item.qty)}`)
    : ['Panier vide'];
  return `Bonjour Mortech Solutions, je souhaite commander:\n${lines.join('\n')}\nTotal: ${formatPrice(total)}`;
}

function getRoute() {
  return window.location.pathname === '/' ? '/' : window.location.pathname.replace(/\/$/, '');
}

function getLocationKey() {
  return `${getRoute()}${window.location.search}`;
}

function getCategoryUrl(category, subcategory) {
  if (!category || category === 'Tous') return '/produits';
  const params = new URLSearchParams({ categorie: category });
  if (subcategory) params.set('type', subcategory);
  return `/produits?${params.toString()}`;
}

function normalizeProductCategory(category) {
  return category;
}

function shouldFilterSubcategory(groupName) {
  return groupName === 'Videosurveillance' || groupName === 'Securite' || groupName === 'Materiel Informatique' || groupName === 'Equipement Reseaux' || groupName === 'Domotique' || groupName === 'Controle Dacces et Pointeuse';
}

function Link({ to, children, className, onNavigate, ...props }) {
  function handleClick(event) {
    event.preventDefault();
    window.history.pushState({}, '', to);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNavigate?.();
  }

  return <a href={to} className={className} onClick={handleClick} {...props}>{children}</a>;
}

function App() {
  const [locationKey, setLocationKey] = useState(getLocationKey);
  const route = useMemo(() => getRoute(), [locationKey]);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [activeSubcategory, setActiveSubcategory] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [loginSent, setLoginSent] = useState(false);

  useEffect(() => {
    const syncRoute = () => setLocationKey(getLocationKey());
    window.addEventListener('popstate', syncRoute);
    return () => window.removeEventListener('popstate', syncRoute);
  }, []);

  const categories = useMemo(() => ['Tous', ...new Set(products.map((product) => product.category))], []);
  const cartCount = cart.reduce((total, item) => total + item.qty, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.qty, 0);

  useEffect(() => {
    if (route !== '/produits') return;
    const params = new URLSearchParams(window.location.search);
    const requestedCategory = params.get('categorie');
    const requestedSubcategory = params.get('type');
    setActiveCategory(requestedCategory || 'Tous');
    setActiveSubcategory(requestedSubcategory || '');
  }, [route, locationKey]);

  const filteredProducts = useMemo(() => {
    let sectionLinks = null;
    if (activeSubcategory) {
      for (const group of categoryGroups) {
        const sec = group.sections.find((s) => s.name.toLowerCase() === activeSubcategory.toLowerCase());
        if (sec) {
          sectionLinks = sec.links.map((l) => l.toLowerCase());
          break;
        }
      }
    }

    return products.filter((product) => {
      const matchesCategory = activeCategory === 'Tous' || product.category === activeCategory;
      const matchesSubcategory =
        !activeSubcategory ||
        product.subcategory === activeSubcategory ||
        (product.subcategory && sectionLinks && sectionLinks.includes(product.subcategory.toLowerCase())) ||
        (product.brand && product.brand.toLowerCase() === activeSubcategory.toLowerCase());
      const matchesQuery = `${product.name} ${product.brand} ${product.category} ${product.subcategory || ''}`.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesSubcategory && matchesQuery;
    });
  }, [activeCategory, activeSubcategory, query]);

  function addToCart(product) {
    if (!product.stock) return;
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
      }
      return [...current, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  }

  function selectCategory(category) {
    setActiveCategory(category);
    setActiveSubcategory('');
    if (route !== '/produits') return;

    const nextUrl = getCategoryUrl(category);
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    if (currentUrl !== nextUrl) {
      window.history.pushState({}, '', nextUrl);
      setLocationKey(getLocationKey());
    }
  }

  function updateQty(id, amount) {
    setCart((current) =>
      current
        .map((item) => (item.id === id ? { ...item, qty: Math.max(0, item.qty + amount) } : item))
        .filter((item) => item.qty > 0),
    );
  }

  function submitContact(event) {
    event.preventDefault();
    setMessageSent(true);
  }

  function submitLogin(event) {
    event.preventDefault();
    setLoginSent(true);
  }

  function renderPage() {
    const productProps = { categories, activeCategory, activeSubcategory, setActiveCategory: selectCategory, filteredProducts, addToCart };
    if (route === '/produits') {
      return <ProductsPage {...productProps} />;
    }
    if (route === '/panier') {
      return <CartPage cart={cart} total={cartTotal} updateQty={updateQty} />;
    }
    if (route === '/services') {
      return <ServicesPage />;
    }
    if (route === '/contact') {
      return <ContactPage onSubmit={submitContact} messageSent={messageSent} />;
    }
    if (route === '/login') {
      return <LoginPage onSubmit={submitLogin} loginSent={loginSent} />;
    }
    if (route === '/inscription') {
      return <RegisterPage />;
    }
    if (route === '/apropos') {
      return <AboutPage />;
    }
    return <HomePage productProps={productProps} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />;
  }

  return (
    <>
      <Header
        query={query}
        setQuery={setQuery}
        cartCount={cartCount}
        cartTotal={cartTotal}
        route={route}
        onCart={() => setIsCartOpen(true)}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      <main>{renderPage()}</main>
      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} total={cartTotal} updateQty={updateQty} />
    </>
  );
}

function Header({ query, setQuery, cartCount, cartTotal, route, isMenuOpen, setIsMenuOpen }) {
  return (
    <header className="site-header">
      <div className="topbar">
        <span><Phone size={14} /> +(212) 528.24.17.43</span>
        <span><Mail size={14} /> contact@mortech-solutions.ma</span>
        <span><MapPin size={14} /> Agadir, Maroc</span>
        <Link to="/login">Mon compte</Link>
        <Link to="/inscription">Creer un compte</Link>
      </div>
      <div className="nav-shell">
        <button className="icon-button mobile-only" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu categories">
          {isMenuOpen ? <X /> : <Menu />}
        </button>
        <Link className="brand" to="/" aria-label="Mortech Solutions">
          <img src={logo} alt="Mortech Solutions" />
        </Link>
        <div className="search-box">
          <select aria-label="Categorie recherche">
            <option>Toutes categories</option>
            <option>Videosurveillance</option>
            <option>Reseaux</option>
            <option>Domotique</option>
          </select>
          <Search size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher camera, switch, alarme..." />
        </div>
        <nav className="main-nav">
          <Link className={route === '/' ? 'active' : ''} to="/">Accueil</Link>
          <Link className={route === '/produits' ? 'active' : ''} to="/produits">Produits</Link>
          <Link className={route === '/services' ? 'active' : ''} to="/services">Services</Link>
          <Link className={route === '/contact' ? 'active' : ''} to="/contact">Contact</Link>
          <Link className={route === '/apropos' ? 'active' : ''} to="/apropos">A propos</Link>
          <Link className={route === '/login' ? 'active' : ''} to="/login">Login</Link>
        </nav>
        <Link className="cart-button" to="/panier">
          <ShoppingCart size={20} />
          <span>{cartCount}</span>
          <strong>{formatPrice(cartTotal)}</strong>
        </Link>
      </div>
    </header>
  );
}

function HomePage({ productProps, isMenuOpen, setIsMenuOpen }) {
  return (
    <>
      <Hero />
      <CategoryShowcase />
      <CategoryBrowser isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <ProductsSection {...productProps} limit={6} title="Produits populaires" />
      <QuickCategories />
      <Services compact />
      <PolicyPreview />
    </>
  );
}

function ProductsPage(props) {
  return (
    <>
      <CategoryBrowser isMenuOpen setIsMenuOpen={() => {}} />
      <ProductsSection {...props} title="Catalogue produits" />
    </>
  );
}

function CartPage({ cart, total, updateQty }) {
  const whatsappUrl = `https://wa.me/212528241743?text=${encodeURIComponent(buildWhatsAppOrder(cart, total))}`;

  return (
    <section className="page-shell">
      <div className="section-heading">
        <div><span className="eyebrow">Commande</span><h1>Panier</h1></div>
        <Link className="secondary-button compact" to="/produits">Continuer les achats</Link>
      </div>
      <div className="cart-page-grid">
        <div className="cart-page-list">
          {cart.map((item) => (
            <article className="cart-page-item" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div>
                <span>{item.brand}</span>
                <h3>{item.name}</h3>
                <strong>{formatPrice(item.price)}</strong>
              </div>
              <div className="qty-controls">
                <button onClick={() => updateQty(item.id, -1)}><Minus size={14} /></button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.id, 1)}><Plus size={14} /></button>
              </div>
            </article>
          ))}
          {!cart.length && <p className="empty-state">Votre panier est vide. Ajoutez des produits depuis le catalogue.</p>}
        </div>
        <aside className="checkout-card">
          <h2>Resume</h2>
          <div><span>Sous-total</span><strong>{formatPrice(total)}</strong></div>
          <div><span>Livraison</span><strong>Sur devis</strong></div>
          <div className="checkout-total"><span>Total</span><strong>{formatPrice(total)}</strong></div>
          <button className="primary-button full" type="button">Valider mon panier</button>
          <a className="whatsapp-button full" href={whatsappUrl} target="_blank" rel="noreferrer">Commander par WhatsApp</a>
          <Link className="primary-button full" to="/contact">Demander un devis</Link>
        </aside>
      </div>
    </section>
  );
}

function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Accompagnement technique"
        text="Mortech Solutions aide les clients a choisir, commander et deployer leurs solutions IT, reseaux, securite et domotique."
      />
      <Services />
      <PolicyPreview />
    </>
  );
}

function ContactPage({ onSubmit, messageSent }) {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Nous contacter"
        text="Contactez-nous pour toute question ou demande. Remplissez le formulaire et nous vous repondrons dans les plus brefs delais."
      />
      <ContactSection onSubmit={onSubmit} messageSent={messageSent} />
    </>
  );
}

function ContactSection({ onSubmit, messageSent }) {
  return (
    <section className="contact-section">
      <div className="contact-container">
        <div className="contact-info">
          <h2>Contact</h2>
          <p>Contactez-nous pour toute question, commentaire ou demande. Remplissez simplement le formulaire ci-dessous et nous vous repondrons dans les plus brefs delais. Votre satisfaction est notre priorite</p>
          
          <div className="contact-details">
            <div className="contact-item">
              <MapPin size={20} />
              <div>
                <strong>Adresse</strong>
                <p>Agadir, Maroc</p>
              </div>
            </div>
            
            <div className="contact-item">
              <Mail size={20} />
              <div>
                <strong>Email</strong>
                <a href="mailto:contact@mortech-solutions.ma">contact@mortech-solutions.ma</a>
              </div>
            </div>
            
            <div className="contact-item">
              <Phone size={20} />
              <div>
                <strong>Telephone</strong>
                <a href="tel:+212528241743">+(212) 528 241 743</a>
                <span> / </span>
                <a href="tel:+212528241743">+(212) 528 241 743</a>
              </div>
            </div>
          </div>

          <div className="contact-map">
            <iframe 
              title="Localisation Mortech Solutions"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3438.7889023755006!2d-9.598!3d30.427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDI1JzM2LjAiTiA5wrAzNSc1Mi44Ilc!5e0!3m2!1sfr!2sma!4v1234567890" 
              width="100%" 
              height="300" 
              style={{border: 0, borderRadius: '8px'}}
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>

        <div className="contact-form-wrapper">
          <h2>Service contact email</h2>
          <form onSubmit={onSubmit}>
            <label>
              <span>Nom (obligatoire)</span>
              <input type="text" required placeholder="Votre nom" />
            </label>
            
            <label>
              <span>E-mail (obligatoire)</span>
              <input type="email" required placeholder="votre.email@exemple.com" />
            </label>
            
            <label>
              <span>Sujet</span>
              <input type="text" placeholder="Sujet de votre message" />
            </label>
            
            <label>
              <span>Message (obligatoire)</span>
              <textarea required placeholder="Decrivez votre besoin..."></textarea>
            </label>
            
            <button className="primary-button" type="submit">Envoyer</button>
            {messageSent && <p className="success"><Check size={16} /> Votre message a ete envoye avec succes!</p>}
          </form>
        </div>
      </div>
    </section>
  );
}

function LoginPage({ onSubmit, loginSent }) {
  return (
    <section className="auth-page">
      <div className="auth-panel">
        <span className="eyebrow">Mon compte</span>
        <h1>Connexion</h1>
        <p>Accedez a votre espace client pour suivre vos demandes, devis et commandes.</p>
        <form onSubmit={onSubmit}>
          <label>Email<input type="email" required placeholder="client@email.com" /></label>
          <label>Mot de passe<input type="password" required placeholder="********" /></label>
          <button className="primary-button" type="submit">Se connecter</button>
        </form>
        {loginSent && <p className="success"><Check size={16} /> Formulaire de connexion valide.</p>}
        <Link className="secondary-button full" to="/inscription"><UserPlus size={17} /> Creer un compte</Link>
      </div>
    </section>
  );
}

function RegisterPage() {
  return (
    <section className="auth-page">
      <div className="auth-panel wide">
        <span className="eyebrow">Nouveau client</span>
        <h1>Creation de compte</h1>
        <form>
          <label>Nom complet<input required placeholder="Votre nom" /></label>
          <label>Societe<input placeholder="Nom de societe" /></label>
          <label>Email<input type="email" required placeholder="client@email.com" /></label>
          <label>Telephone<input required placeholder="+212 ..." /></label>
          <label>Mot de passe<input type="password" required placeholder="********" /></label>
          <button className="primary-button" type="button">Creer le compte</button>
        </form>
        <Link className="secondary-button full" to="/login">J'ai deja un compte</Link>
      </div>
    </section>
  );
}

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="A propos"
        title="Mortech Solutions"
        text="Une boutique professionnelle pour centraliser vos besoins en securite electronique, reseau, informatique et automatisme."
      />
      <PolicyPreview />
      <Services />
    </>
  );
}

function PageHero({ eyebrow, title, text }) {
  return (
    <section className="page-hero">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{text}</p>
    </section>
  );
}

function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const [sliderIndex, setSliderIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setWordIndex((current) => (current + 1) % dynamicHeroWords.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const sliderTimer = window.setInterval(() => {
      setSliderIndex((current) => (current + 1) % dynamicHeroWords.length);
    }, 3500);
    return () => window.clearInterval(sliderTimer);
  }, []);

  const sliderItems = [
    { title: 'Videosurveillance', icon: Camera, text: 'Cameras IP et analogiques haute qualite' },
    { title: 'Reseaux', icon: Network, text: 'Equipements reseau professionnels' },
    { title: 'Domotique', icon: Home, text: 'Solutions de maison connectee' },
    { title: 'Controle d\'acces', icon: ShieldCheck, text: 'Systemes securises et pointage' },
    { title: 'Informatique', icon: Cpu, text: 'Materiel IT et stockage professionnel' },
  ];

  return (
    <section className="hero" id="accueil">
      <div className="hero-content">
        <span className="eyebrow">Infrastructure de securite electronique et informatique</span>
        <h1>Mortech Solutions</h1>
        <div className="dynamic-title" aria-live="polite">
          Expert en <span key={dynamicHeroWords[wordIndex]}>{dynamicHeroWords[wordIndex]}</span>
        </div>
        <p>Boutique professionnelle pour videosurveillance, reseaux, controle d'acces, domotique, informatique et solutions de securite.</p>
        <div className="hero-actions">
          <Link className="primary-button" to="/produits">Voir les produits</Link>
        </div>
      </div>
      <div className="hero-slider">
        <div className="slider-container">
          {sliderItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                className={`slider-item ${idx === sliderIndex ? 'active' : ''}`} 
                key={item.title}
              >
                <Icon size={48} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            );
          })}
        </div>
        <div className="slider-dots">
          {sliderItems.map((item, idx) => (
            <button 
              key={item.title} 
              className={`dot ${idx === sliderIndex ? 'active' : ''}`}
              onClick={() => setSliderIndex(idx)}
              aria-label={`Aller a ${sliderItems[idx].title}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryBrowser({ isMenuOpen, setIsMenuOpen }) {
  return (
    <section className={`category-browser ${isMenuOpen ? 'is-open' : ''}`}>
      <div className="section-heading">
        <div><span className="eyebrow">Catalogue</span><h2>Categories de produits</h2></div>
      </div>
      <div className="category-panel">
        <div className="category-panel-title">Categories de produits</div>
        <div className="category-tree">
          {categoryGroups.map((group) => (
            <article className="category-group" key={group.name}>
              <h3>
                <Link to={getCategoryUrl(normalizeProductCategory(group.name))}>
                  <ChevronDown size={15} />{group.name}
                </Link>
              </h3>
              <div className="category-branches">
                {group.sections.map((section) => (
                  <div className="category-branch" key={section.name}>
                    {shouldFilterSubcategory(group.name) ? (
                      <Link to={getCategoryUrl(normalizeProductCategory(group.name), section.name)} className="category-section-link">
                        {section.name}
                      </Link>
                    ) : (
                      <strong>{section.name}</strong>
                    )}
                    <div className="category-links">
                      {section.links.map((link) => (
                        <Link to={getCategoryUrl(normalizeProductCategory(group.name), shouldFilterSubcategory(group.name) ? link : '')} key={link}>
                          {link}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


function CategoryShowcase() {
  const showcaseCategories = [
    {
      title: 'Videosurveillance',
      icon: Camera,
      description: 'Cameras IP et analogiques professionnelles',
      brands: ['Hikvision', 'Dahua', 'Uniview']
    },
    {
      title: 'Reseaux & Communication',
      icon: Network,
      description: 'Equipements reseau et connectivite',
      brands: ['TP-Link', 'Ruijie', 'Cisco']
    },
    {
      title: 'Controle d\'acces & Pointage',
      icon: ShieldCheck,
      description: 'Systemes d\'identification et de controle',
      brands: ['Hikvision', 'ZKTeco', 'Dahua']
    },
    {
      title: 'Domotique',
      icon: Home,
      description: 'Solutions connectees',
      brands: ['Somfy', 'Sonoff', 'Tuya']
    },
    {
      title: 'Securite & Alarmes',
      icon: AlarmSmoke,
      description: 'Systemes de detection intrusion et incendie',
      brands: ['Ajax', 'Hikvision', 'Nugelec']
    },
    {
      title: 'Informatique & Stockage',
      icon: Cpu,
      description: 'Materiel IT et solutions de stockage',
      brands: ['Kingston', 'SanDisk', 'WD']
    },
  ];

  return (
    <section className="category-showcase">
      <div className="section-heading">
        <div><span className="eyebrow">Solutions</span><h2>Nos domaines de competence</h2></div>
      </div>
      <div className="showcase-grid">
        {showcaseCategories.map(({ title, icon: Icon, description, brands }) => (
          <Link 
            to={getCategoryUrl(normalizeProductCategory(title.replace(' & ', ' Et ')))} 
            className="showcase-card" 
            key={title}
          >
            <div className="showcase-icon">
              <Icon size={32} />
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
            <div className="showcase-brands">
              {brands.map(brand => <span key={brand}>{brand}</span>)}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function QuickCategories() {
  return (
    <section className="quick-categories">
      <div className="section-heading">
        <div><span className="eyebrow">Cette semaine</span><h2>Categories les plus demandees</h2></div>
        <Link to="/produits">Tous les produits</Link>
      </div>
      <div className="quick-grid">
        {quickCategories.map(([title, text, Icon, category]) => (
          <Link to={getCategoryUrl(category)} className="quick-card" key={title}>
            <Icon size={24} /><strong>{title}</strong><span>{text}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ProductsSection({ categories, activeCategory, activeSubcategory, setActiveCategory, filteredProducts, addToCart, limit, title = 'Produits populaires' }) {
  const visibleProducts = limit ? filteredProducts.slice(0, limit) : filteredProducts;
  const visibleCategories = categories.includes(activeCategory) ? categories : [...categories, activeCategory];
  const sectionTitle = activeSubcategory || title;
  return (
    <section className="products-section" id="produits">
      <div className="section-heading">
        <div><span className="eyebrow">Boutique</span><h2>{sectionTitle}</h2></div>
        <div className="tabs" role="tablist" aria-label="Filtrer produits">
          {visibleCategories.map((category) => (
            <button className={category === activeCategory ? 'active' : ''} key={category} onClick={() => setActiveCategory(category)}>
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className="product-grid">
        {visibleProducts.map((product) => <ProductCard key={product.id} product={product} addToCart={addToCart} />)}
      </div>
      {!filteredProducts.length && <p className="empty-state">Aucun produit ne correspond a votre recherche.</p>}
      {limit && filteredProducts.length > limit && <Link className="primary-button more-products" to="/produits">Voir tout le catalogue</Link>}
    </section>
  );
}

function ProductCard({ product, addToCart }) {
  return (
    <article className="product-card">
      <div className="product-media">
        <span className="badge">{product.badge}</span>
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <span>{product.brand}</span>
        <h3>{product.name}</h3>
        <div className="rating"><Star size={15} fill="currentColor" /> <span>Disponible conseil technique</span></div>
        <div className="product-footer">
          <strong>{product.stock ? formatPrice(product.price) : 'Contactez-nous'}</strong>
          <button onClick={() => addToCart(product)} disabled={!product.stock}>
            {product.stock ? <><ShoppingCart size={17} /> Ajouter</> : 'Devis'}
          </button>
        </div>
      </div>
    </article>
  );
}

function Services() {
  const services = [
    [Truck, 'Livraison Maroc', 'Preparation rapide et suivi des commandes pour clients professionnels.'],
    [ShieldCheck, 'Garantie materiel', 'Produits selectionnes avec accompagnement technique et SAV.'],
    [Headphones, 'Support projet', 'Aide au choix pour installation camera, reseau, alarme et pointage.'],
    [CreditCard, 'Devis & panier', 'Ajoutez les produits au panier ou demandez un devis selon le stock.'],
  ];

  return (
    <section className="services" id="services">
      {services.map(([Icon, title, text]) => (
        <article key={title}><Icon /><h3>{title}</h3><p>{text}</p></article>
      ))}
    </section>
  );
}

function AccountAndContact({ onSubmit, messageSent }) {
  return (
    <section className="forms-section" id="contact">
      <div className="account-panel">
        <span className="eyebrow">Mon compte</span>
        <h2>Espace client</h2>
        <form>
          <label>Email<input type="email" placeholder="client@email.com" /></label>
          <label>Mot de passe<input type="password" placeholder="********" /></label>
          <button type="button" className="primary-button">Connexion</button>
          <button type="button" className="secondary-button">Creer un compte</button>
        </form>
      </div>
      <div className="contact-panel">
        <span className="eyebrow">Contact</span>
        <h2>Parlez-nous de votre besoin</h2>
        <form onSubmit={onSubmit}>
          <label>Nom complet<input required placeholder="Votre nom" /></label>
          <label>Telephone<input required placeholder="+212 ..." /></label>
          <label>Projet<textarea required placeholder="Camera, reseau, controle d'acces, domotique..." /></label>
          <button className="primary-button" type="submit">Envoyer la demande</button>
        </form>
        {messageSent && <p className="success"><Check size={16} /> Votre demande est prete a etre traitee.</p>}
      </div>
    </section>
  );
}

function PolicyPreview() {
  return (
    <section className="policy-section" id="apropos">
      <article><Building2 /><h3>A propos</h3><p>Mortech Solutions accompagne les entreprises dans les infrastructures IT, securite electronique et automatismes.</p></article>
      <article><Truck /><h3>Livraison</h3><p>Preparation de commande, confirmation de disponibilite et livraison selon ville et volume du materiel.</p></article>
      <article><ShieldCheck /><h3>Retour & CGV</h3><p>Conditions professionnelles claires pour retours, garanties, validation devis et commande.</p></article>
    </section>
  );
}

function CartDrawer({ isOpen, onClose, cart, total, updateQty }) {
  return (
    <aside className={`cart-drawer ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen}>
      <div className="cart-head">
        <h2>Panier</h2>
        <button className="icon-button" onClick={onClose} aria-label="Fermer panier"><X /></button>
      </div>
      <div className="cart-items">
        {cart.map((item) => (
          <div className="cart-item" key={item.id}>
            <img src={item.image} alt={item.name} />
            <div>
              <strong>{item.name}</strong>
              <span>{formatPrice(item.price)}</span>
              <div className="qty-controls">
                <button onClick={() => updateQty(item.id, -1)}><Minus size={14} /></button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.id, 1)}><Plus size={14} /></button>
              </div>
            </div>
          </div>
        ))}
        {!cart.length && <p className="empty-state">Votre panier est vide.</p>}
      </div>
      <div className="cart-total"><span>Total</span><strong>{formatPrice(total)}</strong></div>
      <Link className="primary-button full" to="/panier" onNavigate={onClose}>Voir le panier</Link>
    </aside>
  );
}

function Footer() {
  return (
    <footer>
      <img src={logo} alt="Mortech Solutions" />
      <div><strong>Mortech Solutions</strong><span>Videosurveillance, reseaux, domotique, alarme et informatique professionnelle.</span></div>
      <a href="tel:+212528241743"><Phone size={16} /> +(212) 528.24.17.43</a>
    </footer>
  );
}

createRoot(document.getElementById('root')).render(<App />);
