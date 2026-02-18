import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    farm_types: [
      {
        id: 'wheat',
        name_az: 'Taxıl təsərrüfatı',
        name_en: 'Wheat/Cereals Farm',
        description_az: 'Buğda, arpa və digər dənli bitkilər',
      },
      {
        id: 'livestock',
        name_az: 'Heyvandarlıq',
        name_en: 'Livestock Farm',
        description_az: 'Mal-qara, qoyun, keçi, quşçuluq',
      },
      {
        id: 'orchard',
        name_az: 'Meyvə bağı',
        name_en: 'Orchard',
        description_az: 'Alma, üzüm, nar, əncir və digər meyvələr',
      },
      {
        id: 'vegetable',
        name_az: 'Tərəvəzçilik',
        name_en: 'Vegetable Farm',
        description_az: 'Pomidor, xiyar, kartof və digər tərəvəzlər',
      },
      {
        id: 'mixed',
        name_az: 'Qarışıq təsərrüfat',
        name_en: 'Mixed Farm',
        description_az: 'Bitkiçilik və heyvandarlıq birlikdə',
      },
    ],
  });
}
