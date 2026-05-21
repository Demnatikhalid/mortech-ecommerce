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
import cameraAnalogImage from './assets/products/camera-analog.png';
import cameraIpImage from './assets/products/camera-ip.png';
import dvrImage from './assets/products/dvr.png';
import nvrImage from './assets/products/nvr.png';
import videophoneImage from './assets/products/videophone.png';
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
      { name: 'Hikvision', links: ['Camera Analog', 'Camera IP', 'DVR', 'NVR', 'Videophone'] },
      { name: 'Dahua', links: ['Camera Analog', 'Camera IP', 'XVR', 'NVR', 'Videophone'] },
      { name: 'Accessoires de camera', links: ['Cable Coaxial', 'Boites de jonction', 'Support de camera', "Bloc d'alimentation"] },
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
    name: 'Automatisme Et Domotique',
    sections: [
      { name: 'Domotique', links: ['TAHOMA SOMFY', 'AKUVOX', 'Tuya', 'Sonoff', 'Shelly'] },
      { name: 'Automatisme', links: ['BFT', 'Tringles a rideaux motorise', 'NICE', 'Selecteur', 'Porte Vitree'] },
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
    subcategory: 'Camera IP',
    name: 'Dahua Technology Lite SD2A500HB-GN-AW-PV-S2',
    price: 6000,
    badge: 'PTZ Wi-Fi',
    image: cameraIpImage,
    stock: true,
  },
  {
    id: 2,
    brand: 'Dahua',
    category: 'Videosurveillance',
    subcategory: 'Camera IP',
    name: 'Camera IP Wi-Fi Ranger 2 IPC-A22EP-G',
    price: 384,
    badge: 'Best seller',
    image: cameraIpImage,
    stock: true,
  },
  {
    id: 3,
    brand: 'Dahua',
    category: 'Videosurveillance',
    subcategory: 'Camera IP',
    name: 'Camera IP Dahua Bullet 4MP Lite Full-color',
    price: 624,
    badge: '4MP',
    image: cameraIpImage,
    stock: true,
  },
  {
    id: 4,
    brand: 'Hikvision',
    category: 'Videosurveillance',
    subcategory: 'Camera Analog',
    name: 'Camera Analogique 5MP IR 40m Bullet DS-2CE10KF0T-LFS',
    price: 420,
    badge: 'IR 40m',
    image: cameraAnalogImage,
    stock: true,
  },
  {
    id: 5,
    brand: 'Hikvision',
    category: 'Videosurveillance',
    subcategory: 'DVR',
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
    category: 'Automatisme & Domotique',
    subcategory: 'Sonoff',
    name: 'Sonoff 4CH Pro R3 module domotique',
    price: 395,
    badge: 'Smart home',
    image: 'https://disismaroc.com/storage/products/145/591/disismaroc-sonoff-4ch-pro-r3-4chr3--1743514131-6708.png',
    stock: true,
  },
  {
    id: 9,
    brand: 'Uniview',
    category: 'Videosurveillance',
    subcategory: 'Camera IP',
    name: 'Camera IP Uniview Bullet 4MP vision nocturne',
    price: 690,
    badge: 'IP 4MP',
    image: cameraIpImage,
    stock: true,
  },
  {
    id: 10,
    brand: 'Hikvision',
    category: 'Videosurveillance',
    subcategory: 'NVR',
    name: 'NVR Hikvision 8 canaux PoE pour camera IP',
    price: 1250,
    badge: 'NVR PoE',
    image: nvrImage,
    stock: true,
  },
  {
    id: 11,
    brand: 'ZKTeco',
    category: 'Controle Dacces et Pointeuse',
    subcategory: 'Pointeuse ZKTeco',
    name: 'Pointeuse ZKTeco biometrie empreinte et badge',
    price: 1450,
    badge: 'Pointage',
    image: 'https://zkteco.technology/wp-content/uploads/2022/01/c00444fc2e4cb4d4f513af79ca6e1fe3.png',
    stock: true,
  },
  {
    id: 12,
    brand: 'Hikvision',
    category: 'Controle Dacces et Pointeuse',
    subcategory: "Controle d'acces hikvision",
    name: "Terminal controle d'acces Hikvision badge RFID",
    price: 1180,
    badge: 'RFID',
    image: 'https://www.bhphotovideo.com/cdn-cgi/image/fit%3Dscale-down%2Cwidth%3D500%2Cquality%3D95/https%3A//www.bhphotovideo.com/images/images500x500/hikvision_ds_k1t502dbwx_c_access_control_terminal_1715868963_1753179.jpg',
    stock: true,
  },
  {
    id: 13,
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
    id: 14,
    brand: 'Ajax',
    category: 'Securite',
    subcategory: 'Alarme Ajax',
    name: 'Kit alarme Ajax Hub avec detecteur mouvement',
    price: 2890,
    badge: 'Alarme',
    image: 'https://media1.lisintec.com/1576-superlarge_default/ajax-starterkit-cam-with-motioncam-detector-white-color.jpg',
    stock: true,
  },
  {
    id: 15,
    brand: 'Hikvision',
    category: 'Securite',
    subcategory: 'ALARME HIKVISION',
    name: 'Detecteur intrusion Hikvision sans fil PIR',
    price: 390,
    badge: 'Intrusion',
    image: 'https://www.ctccommunications.com.au/cdn/shop/products/Hikvison-Wireless-PIR-Detector-DS-PDP15P-EG2-WB_1_ba917418-9201-478e-973f-3447445c2683_600x600.jpg?v=1752449306',
    stock: true,
  },
  {
    id: 16,
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
    id: 17,
    brand: 'Hikvision',
    category: 'Videosurveillance',
    subcategory: 'Videophone',
    name: 'Videophone IP ecran tactile 7 pouces avec interphone',
    price: 1850,
    badge: 'Videophone',
    image: videophoneImage,
    stock: true,
  },
  {
    id: 18,
    brand: 'Alarm Cable',
    category: 'Securite',
    subcategory: 'Cable alarm',
    name: 'Cable alarme 6 conducteurs pour systeme intrusion',
    price: 180,
    badge: 'Cable alarm',
    image: 'https://m.media-amazon.com/images/I/61tdfycQFGL._AC_SL1500_.jpg',
    stock: true,
  },
  {
    id: 19,
    brand: 'Dahua',
    category: 'Securite',
    subcategory: 'Alarme Dahua',
    name: 'Kit alarme Dahua sans fil avec sirene et detecteur',
    price: 1690,
    badge: 'Dahua',
    image: 'https://www.dynamic-cctv.com/media/catalog/product/cache/befdb3aa601699c68ab8abcf39fb0fd9/a/r/arc3000h-w2_4.jpg',
    stock: true,
  },
  {
    id: 20,
    brand: 'Autonome',
    category: 'Securite',
    subcategory: 'Alarme Autonome',
    name: 'Alarme autonome avec sirene integree et detecteur',
    price: 590,
    badge: 'Autonome',
    image: 'https://m.media-amazon.com/images/I/61dp7ES21YL._AC_SL1500_.jpg',
    stock: true,
  },
  {
    id: 21,
    brand: 'Fire Cable',
    category: 'Securite',
    subcategory: 'Cable incendie',
    name: 'Cable incendie CR1 rouge 2 conducteurs',
    price: 220,
    badge: 'Cable feu',
    image: 'https://m.media-amazon.com/images/I/61tdfycQFGL._AC_SL1500_.jpg',
    stock: true,
  },
  {
    id: 22,
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
    id: 23,
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
    id: 24,
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
    id: 25,
    brand: 'Mortech',
    category: 'Videosurveillance',
    subcategory: 'Cable Coaxial',
    name: 'Cable coaxial RG59 pour camera analogique',
    price: 260,
    badge: 'Coaxial',
    image: 'https://m.media-amazon.com/images/I/61tdfycQFGL._AC_SL1500_.jpg',
    stock: true,
  },
  {
    id: 26,
    brand: 'Dahua',
    category: 'Videosurveillance',
    subcategory: 'Boites de jonction',
    name: 'Boite de jonction etanche pour camera bullet',
    price: 95,
    badge: 'Jonction',
    image: 'https://m.media-amazon.com/images/I/51-SNFHrMZL._AC_SL1000_.jpg',
    stock: true,
  },
  {
    id: 27,
    brand: 'Hikvision',
    category: 'Videosurveillance',
    subcategory: 'Support de camera',
    name: 'Support mural orientable pour camera dome',
    price: 120,
    badge: 'Support',
    image: 'https://m.media-amazon.com/images/I/61K92M+rYcL._AC_SL1500_.jpg',
    stock: true,
  },
  {
    id: 28,
    brand: 'Mortech',
    category: 'Videosurveillance',
    subcategory: "Bloc d'alimentation",
    name: "Bloc d'alimentation 12V 2A pour camera CCTV",
    price: 75,
    badge: '12V',
    image: 'https://m.media-amazon.com/images/I/61Rtb3gyugL._AC_SL1500_.jpg',
    stock: true,
  },
  {
    id: 29,
    brand: 'Western Digital',
    category: 'Materiel Informatique',
    subcategory: 'HDD',
    name: 'Disque dur HDD 1TB SATA 3.5 pouces',
    price: 520,
    badge: '1TB',
    image: 'https://m.media-amazon.com/images/I/71YPmQP7gUL._AC_SL1500_.jpg',
    stock: true,
  },
  {
    id: 30,
    brand: 'SanDisk',
    category: 'Materiel Informatique',
    subcategory: 'Cartes memoire',
    name: 'Carte memoire microSD 128GB classe 10',
    price: 145,
    badge: '128GB',
    image: 'https://m.media-amazon.com/images/I/617NtexaW2L._AC_SL1500_.jpg',
    stock: true,
  },
  {
    id: 31,
    brand: 'Seagate',
    category: 'Materiel Informatique',
    subcategory: 'Stockage portable',
    name: 'Disque dur portable externe 2TB USB 3.0',
    price: 790,
    badge: 'Portable',
    image: 'https://m.media-amazon.com/images/I/71Q7QPS-2vL._AC_SL1500_.jpg',
    stock: true,
  },
  {
    id: 32,
    brand: 'Kingston',
    category: 'Materiel Informatique',
    subcategory: 'SSDs',
    name: 'SSD SATA 480GB pour ordinateur portable',
    price: 390,
    badge: 'SSD',
    image: 'https://m.media-amazon.com/images/I/71rlC6qvCpL._AC_SL1500_.jpg',
    stock: true,
  },
  {
    id: 33,
    brand: 'Crucial',
    category: 'Materiel Informatique',
    subcategory: 'RAM',
    name: 'Memoire RAM DDR4 8GB 3200MHz',
    price: 290,
    badge: 'DDR4',
    image: 'https://m.media-amazon.com/images/I/61O45C5qASL._AC_SL1500_.jpg',
    stock: true,
  },
  {
    id: 34,
    brand: 'Linkbasic',
    category: 'Equipement Reseaux',
    subcategory: 'Armoire Informatique Etanche',
    name: 'Armoire informatique etanche murale 12U IP65',
    price: 2450,
    badge: 'IP65',
    image: 'https://m.media-amazon.com/images/I/61UBFv91yHL._AC_SL1500_.jpg',
    stock: true,
  },
  {
    id: 35,
    brand: 'Digitus',
    category: 'Equipement Reseaux',
    subcategory: 'Armoire Informatique',
    name: 'Armoire informatique reseau 19 pouces 9U',
    price: 1550,
    badge: '19 pouces',
    image: 'https://m.media-amazon.com/images/I/61Vh91z0pWL._AC_SL1500_.jpg',
    stock: true,
  },
  {
    id: 36,
    brand: 'Mortech',
    category: 'Equipement Reseaux',
    subcategory: "Accessoires d'Armoire",
    name: 'Plateau fixe et multiprise pour armoire reseau',
    price: 320,
    badge: 'Accessoire',
    image: 'https://m.media-amazon.com/images/I/61eRsQJSozL._AC_SL1500_.jpg',
    stock: true,
  },
  {
    id: 37,
    brand: 'TP-Link',
    category: 'Equipement Reseaux',
    subcategory: 'Switch TP-Link',
    name: 'Switch TP-Link Gigabit 8 ports metal',
    price: 290,
    badge: 'TP-Link',
    image: 'https://m.media-amazon.com/images/I/61bY6HfBqKL._AC_SL1500_.jpg',
    stock: true,
  },
  {
    id: 38,
    brand: 'Ruijie Reyee',
    category: 'Equipement Reseaux',
    subcategory: 'Switch PoE',
    name: 'Switch PoE 8 ports pour cameras IP',
    price: 890,
    badge: 'PoE',
    image: 'https://m.media-amazon.com/images/I/61qXV1i58wL._AC_SL1500_.jpg',
    stock: true,
  },
  {
    id: 39,
    brand: 'D-Link',
    category: 'Equipement Reseaux',
    subcategory: 'Switch 8 port',
    name: 'Switch reseau 8 ports Gigabit non manageable',
    price: 260,
    badge: '8 ports',
    image: 'https://m.media-amazon.com/images/I/61sx+XuiOFL._AC_SL1500_.jpg',
    stock: true,
  },
  {
    id: 40,
    brand: 'TP-Link',
    category: 'Equipement Reseaux',
    subcategory: 'Switch 16 port',
    name: 'Switch 16 ports Gigabit rackable',
    price: 760,
    badge: '16 ports',
    image: 'https://m.media-amazon.com/images/I/61w3fPC6dIL._AC_SL1500_.jpg',
    stock: true,
  },
  {
    id: 41,
    brand: 'Cisco',
    category: 'Equipement Reseaux',
    subcategory: 'Switch 24 port',
    name: 'Switch 24 ports Gigabit pour baie reseau',
    price: 1450,
    badge: '24 ports',
    image: 'https://m.media-amazon.com/images/I/61LUzWh56oL._AC_SL1500_.jpg',
    stock: true,
  },
  {
    id: 42,
    brand: 'Somfy',
    category: 'Automatisme & Domotique',
    subcategory: 'TAHOMA SOMFY',
    name: 'Box domotique Somfy TaHoma Switch',
    price: 1890,
    badge: 'TaHoma',
    image: 'https://m.media-amazon.com/images/I/51dNfq+tzAL._AC_SL1000_.jpg',
    stock: true,
  },
  {
    id: 43,
    brand: 'Akuvox',
    category: 'Automatisme & Domotique',
    subcategory: 'AKUVOX',
    name: 'Moniteur interieur Akuvox pour maison connectee',
    price: 2450,
    badge: 'Akuvox',
    image: 'https://m.media-amazon.com/images/I/51m-vTyM3JL._AC_SL1000_.jpg',
    stock: true,
  },
  {
    id: 44,
    brand: 'Tuya',
    category: 'Automatisme & Domotique',
    subcategory: 'Tuya',
    name: 'Interrupteur intelligent Tuya Wi-Fi tactile',
    price: 180,
    badge: 'Tuya',
    image: 'https://m.media-amazon.com/images/I/51k51JYXbIL._AC_SL1000_.jpg',
    stock: true,
  },
  {
    id: 45,
    brand: 'Shelly',
    category: 'Automatisme & Domotique',
    subcategory: 'Shelly',
    name: 'Module relais Shelly Plus 1 Wi-Fi',
    price: 210,
    badge: 'Shelly',
    image: 'https://m.media-amazon.com/images/I/61NAdWicQ7L._AC_SL1500_.jpg',
    stock: true,
  },
  {
    id: 46,
    brand: 'BFT',
    category: 'Automatisme & Domotique',
    subcategory: 'BFT',
    name: 'Moteur portail coulissant BFT avec accessoires',
    price: 3290,
    badge: 'Portail',
    image: 'https://m.media-amazon.com/images/I/61EptLgVaRL._AC_SL1500_.jpg',
    stock: true,
  },
  {
    id: 47,
    brand: 'Somfy',
    category: 'Automatisme & Domotique',
    subcategory: 'Tringles a rideaux motorise',
    name: 'Tringle a rideaux motorisee avec telecommande',
    price: 1650,
    badge: 'Rideaux',
    image: 'https://m.media-amazon.com/images/I/61r2OZgYLBL._AC_SL1500_.jpg',
    stock: true,
  },
  {
    id: 48,
    brand: 'NICE',
    category: 'Automatisme & Domotique',
    subcategory: 'NICE',
    name: 'Kit automatisme portail battant NICE',
    price: 3490,
    badge: 'NICE',
    image: 'https://m.media-amazon.com/images/I/61TZEa9oQjL._AC_SL1500_.jpg',
    stock: true,
  },
  {
    id: 49,
    brand: 'Mortech',
    category: 'Automatisme & Domotique',
    subcategory: 'Selecteur',
    name: 'Selecteur a cle pour automatisme portail',
    price: 190,
    badge: 'Selecteur',
    image: 'https://m.media-amazon.com/images/I/51+c9UTafjL._AC_SL1000_.jpg',
    stock: true,
  },
  {
    id: 50,
    brand: 'Mortech',
    category: 'Automatisme & Domotique',
    subcategory: 'Porte Vitree',
    name: 'Kit automatisme pour porte vitree coulissante',
    price: 4200,
    badge: 'Porte',
    image: 'https://m.media-amazon.com/images/I/51vn6Qz8YxL._AC_SL1000_.jpg',
    stock: true,
  },
  {
    id: 51,
    brand: 'Mortech',
    category: 'Controle Dacces et Pointeuse',
    subcategory: 'Serrure intelligente',
    name: 'Serrure intelligente connectee avec clavier et badge',
    price: 1450,
    badge: 'Smart lock',
    image: 'https://m.media-amazon.com/images/I/61XwZ13C2qL._AC_SL1500_.jpg',
    stock: true,
  },
  {
    id: 52,
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
    id: 53,
    brand: 'Hikvision',
    category: 'Controle Dacces et Pointeuse',
    subcategory: 'Pointeuse hikvision',
    name: 'Pointeuse Hikvision biometrie visage et badge',
    price: 1750,
    badge: 'Pointage',
    image: 'https://www.bhphotovideo.com/cdn-cgi/image/fit%3Dscale-down%2Cwidth%3D500%2Cquality%3D95/https%3A//www.bhphotovideo.com/images/images500x500/hikvision_ds_k1t502dbwx_c_access_control_terminal_1715868963_1753179.jpg',
    stock: true,
  },
  {
    id: 54,
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
    id: 55,
    brand: 'Nugelec',
    category: 'Securite',
    subcategory: 'Detection incendie',
    name: 'Pack detection incendie avec detecteur, declencheur et sirene',
    price: 1380,
    badge: 'Incendie',
    image: 'https://materiel-securite-incendie.fireless.fr/5740-large_default/detecteur-thermovelocimetrique-s3000-nug30247.jpg',
    stock: true,
  },
];

const quickCategories = [
  ['Uniview Camera', 'Camera IP et NVR professionnels', Camera, 'Videosurveillance'],
  ['Hikvision Camera', 'Surveillance analogique et IP', ShieldCheck, 'Videosurveillance'],
  ['Domotique Sonoff', 'Modules connectes et capteurs', Home, 'Automatisme & Domotique'],
  ['Automatisme Somfy', 'Moteurs et controle portails', Zap, 'Automatisme & Domotique'],
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
  if (category === 'Automatisme Et Domotique') return 'Automatisme & Domotique';
  return category;
}

function shouldFilterSubcategory(groupName) {
  return groupName === 'Videosurveillance' || groupName === 'Securite' || groupName === 'Materiel Informatique' || groupName === 'Equipement Reseaux' || groupName === 'Automatisme Et Domotique' || groupName === 'Controle Dacces et Pointeuse';
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
    return products.filter((product) => {
      const matchesCategory = activeCategory === 'Tous' || product.category === activeCategory;
      const matchesSubcategory = !activeSubcategory || product.subcategory === activeSubcategory;
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
      <CategoryBrowser isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
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
        title="Demander un devis"
        text="Envoyez votre besoin pour recevoir une proposition adaptee au materiel, a la livraison et a l'installation."
      />
      <ContactForm onSubmit={onSubmit} messageSent={messageSent} />
    </>
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

  useEffect(() => {
    const timer = window.setInterval(() => {
      setWordIndex((current) => (current + 1) % dynamicHeroWords.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, []);

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
      <div className="hero-panel">
        <div><Camera /><strong>Materiel securite</strong><span>Dahua, Hikvision, Uniview</span></div>
        <div><ShieldCheck /><strong>Certifie & garanti</strong><span>Conseil, installation et SAV</span></div>
        <div><Network /><strong>Reseaux rapides</strong><span>Switch, fibre, firewall, Wi-Fi</span></div>
      </div>
    </section>
  );
}

function CategoryBrowser({ isMenuOpen, setIsMenuOpen }) {
  return (
    <section className={`category-browser ${isMenuOpen ? 'is-open' : ''}`}>
      <div className="section-heading">
        <div><span className="eyebrow">Catalogue</span><h2>Categories de produits</h2></div>
        <button className="secondary-button compact" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <SlidersHorizontal size={16} /> Parcourir
        </button>
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

function ContactForm({ onSubmit, messageSent }) {
  return (
    <section className="forms-section single" id="contact">
      <div className="contact-panel">
        <span className="eyebrow">Contact</span>
        <h2>Parlez-nous de votre besoin</h2>
        <form onSubmit={onSubmit}>
          <label>Nom complet<input required placeholder="Votre nom" /></label>
          <label>Telephone<input required placeholder="+212 ..." /></label>
          <label>Email<input type="email" placeholder="client@email.com" /></label>
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
