import { Farm } from '../context/AppContext';

export const greenhouseTopology: Farm[] = [
  {
    id: 'farm-kibg',
    name: 'Kiambu Green Valley',
    location: 'Kiambu County, Kenya',
    greenhouses: [
      { id: 'gh-kibg-001', name: 'GH-Kiambu-001' },
      { id: 'gh-kibg-002', name: 'GH-Kiambu-002' },
      { id: 'gh-kibg-003', name: 'GH-Kiambu-003' },
    ]
  },
  {
    id: 'farm-eld-ag',
    name: 'Eldoret Agri-Hub',
    location: 'Uasin Gishu County, Kenya',
    greenhouses: [
      { id: 'gh-eld-001', name: 'GH-Eldoret-001' },
      { id: 'gh-eld-002', name: 'GH-Eldoret-002' },
    ]
  },
  {
    id: 'farm-nak-valley',
    name: 'Nakuru Valley Farms',
    location: 'Nakuru County, Kenya',
    greenhouses: [
      { id: 'gh-nak-001', name: 'GH-Nakuru-001' },
      { id: 'gh-nak-002', name: 'GH-Nakuru-002' },
      { id: 'gh-nak-003', name: 'GH-Nakuru-003' },
      { id: 'gh-nak-004', name: 'GH-Nakuru-004' },
    ]
  },
  {
    id: 'farm-mer-highlands',
    name: 'Meru Highlands Estate',
    location: 'Meru County, Kenya',
    greenhouses: [
      { id: 'gh-mer-001', name: 'GH-Meru-001' },
      { id: 'gh-mer-002', name: 'GH-Meru-002' },
    ]
  },
  {
    id: 'farm-kis-organic',
    name: 'Kisumu Organic Farms',
    location: 'Kisumu County, Kenya',
    greenhouses: [
      { id: 'gh-kis-001', name: 'GH-Kisumu-001' },
    ]
  },
  {
    id: 'farm-nyeri-tech',
    name: 'Nyeri Tech Gardens',
    location: 'Nyeri County, Kenya',
    greenhouses: [
      { id: 'gh-nye-001', name: 'GH-Nyeri-001' },
      { id: 'gh-nye-002', name: 'GH-Nyeri-002' },
      { id: 'gh-nye-003', name: 'GH-Nyeri-003' },
    ]
  }
];