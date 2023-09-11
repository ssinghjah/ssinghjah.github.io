const data = {
  info_type: 'parking',
  headers: [
    'ID',
    'Name',
    'Lat',
    'Lng',
    'Address',
    'Navigate_URL',
    'Website',
    'Cost',
    'Distance to the Mall'
  ],
  values: [
    [
      '1',
      'PMI Parking 1',
      '38.8976095',
      '-77.065774',
      '2400 Virginia Ave., NW location',
      'https://www.google.com/maps/dir//2400+Virginia+Ave+NW,+Washington,+DC+20037/@38.8976095,\\\n' +
        '-77.0544204,17z/',
      'https://www.pmi-parking.com/r/parking/home.aspx',
      '$20 per day',
      '0.5 Miles'
    ],
    [
      '2',
      'PMI Parking 2',
      '38.8498907',
      '-77.0546018',
      '2611 South Clark Street, Arlington, VA',
      'https://www.google.com/maps/dir//2611+S+Clark+St,+Arlington,+VA+22202/@38.8498907,-77.05\\\n' +
        '46018,17z/',
      'https://www.pmi-parking.com/r/parking/home.aspx',
      '$14 per day',
      '3-4 miles'
    ],
    [
      '3',
      'PMI Parking 2',
      '38.8498907',
      '-77.0546018',
      '2611 South Clark Street, Arlington, VA',
      'https://www.google.com/maps/dir//2611+S+Clark+St,+Arlington,+VA+22202/@38.8498907,-77.05\\\n' +
        '46018,17z/',
      'https://www.pmi-parking.com/r/parking/home.aspx',
      '$14 per day',
      '3-4 miles'
    ]
  ]
};

const metroData = {
  info_type: 'metros',
  headers: [
    'ID',
    'Name',
    'Lat',
    'Lng',
    'Line',
    'Navigate',
    'Distance to the Mall'
  ],
  values: [
    [
      '1',
      'Metro Center',
      '38.898666',
      '-77.027647',
      'Blue,Orange,Red',
      'https://www.google.com/maps/dir//Metro+Center,+607+13th+St+NW,+Washington,+DC+20005/@38.8918502,-77.0236405,15.55z',
      '1'
    ]
  ]
};

export default data;
export default metroData;

