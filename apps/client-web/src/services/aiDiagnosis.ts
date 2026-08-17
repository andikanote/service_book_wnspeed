import { GoogleGenAI } from '@google/genai';

export interface DiagnosisResult {
  primaryIssue: string;
  severity: 'Ringan' | 'Sedang' | 'Kritis';
  healthScore: number;
  rootCause: string;
  recommendedPackageId: 'paket-regular' | 'regular-plus' | 'full-service';
  estimatedCostRange: string;
  estimatedLaborTime: string;
  partsToInspect: string[];
  actionPlan: string[];
  telemetrySimulation: {
    engineHeat: string;
    compression: string;
    voltage: string;
    vibrationHz: string;
  };
}

export async function runGeminiDiagnosis(
  brand: string,
  model: string,
  symptoms: string[],
  customNotes?: string
): Promise<DiagnosisResult> {
  const meta = import.meta as unknown as { env?: Record<string, string> };
  const apiKey = meta.env?.VITE_GEMINI_API_KEY || (window as unknown as { GEMINI_API_KEY?: string }).GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
Anda adalah Chief Mechanical Engineer di WE N SPEED Mechanical Lab, bengkel spesialis motor matic berstandar lab data dan presisi tinggi di Indonesia.
Analisis data kendaraan berikut:
- Merk: ${brand}
- Model: ${model || 'Motor Matic'}
- Gejala Gejala yang dialami: ${symptoms.join(', ') || 'Pemeriksaan Rutin'}
- Catatan Tambahan: ${customNotes || 'Tidak ada'}

Kembalikan output DALAM FORMAT JSON MURNI tanpa markdown ticks, dengan skema:
{
  "primaryIssue": "Judul diagnosa teknis ringkas (contoh: Penumpukan Residu Throttle Body & Selip Kampas Ganda CVT)",
  "severity": "Ringan" | "Sedang" | "Kritis",
  "healthScore": 40-95 (integer angka),
  "rootCause": "Penjelasan mekanis mendalam yang edukatif dan transparan dalam Bahasa Indonesia",
  "recommendedPackageId": "paket-regular" | "regular-plus" | "full-service",
  "estimatedCostRange": "Rentang biaya estimasi (contoh: Rp 375.000 - Rp 450.000)",
  "estimatedLaborTime": "Estimasi pengerjaan (contoh: 60 - 90 Menit)",
  "partsToInspect": ["komponen 1", "komponen 2", "komponen 3", "komponen 4"],
  "actionPlan": ["Langkah 1", "Langkah 2", "Langkah 3"],
  "telemetrySimulation": {
    "engineHeat": "92°C",
    "compression": "11.2 PSI",
    "voltage": "12.4 V",
    "vibrationHz": "48 Hz"
  }
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const text = response.text?.trim();
      if (text) {
        return JSON.parse(text) as DiagnosisResult;
      }
    } catch (err) {
      console.warn('Fallback to local mechanical lab engine due to API error:', err);
    }
  }

  // Precision Built-in Rule Engine
  return generateDeterministicDiagnosis(brand, model, symptoms);
}

export function generateDeterministicDiagnosis(
  brand: string,
  model: string,
  symptoms: string[]
): DiagnosisResult {
  const hasGredeg = symptoms.includes('gredeg');
  const hasBrebet = symptoms.includes('brebet');
  const hasNgempos = symptoms.includes('ngempos');
  const hasTarikanBerat = symptoms.includes('tarikan_berat');
  const hasBunyiKasar = symptoms.includes('bunyi_kasar');

  const count = symptoms.length;

  if (count >= 3 || (hasBrebet && hasBunyiKasar) || (hasGredeg && hasNgempos && hasTarikanBerat)) {
    return {
      primaryIssue: 'Degradasi Sistem CVT Total & Malfungsi Injeksi/Throttle',
      severity: 'Kritis',
      healthScore: 54,
      rootCause: `Pada ${brand} ${model || 'Matic'}, kombinasi gejala menunjukkan mangkok ganda aus/kotor oleh debu kampas, roller peyang, serta sumbatan kerak karbon pada injector dan throttle body.`,
      recommendedPackageId: 'full-service',
      estimatedCostRange: 'Rp 490.000 - Rp 580.000',
      estimatedLaborTime: '90 - 120 Menit',
      partsToInspect: ['Mangkok Kampas Ganda', 'V-Belt & Sliding Roller', 'Injector Nozzle & Fuel Pump', 'Throttle Position Sensor (TPS)'],
      actionPlan: [
        'Bongkar CVT dan ukur ketebalan kampas ganda dengan vernier caliper',
        'Ultrasonic cleaning injektor dan reset ECU parameter pabrik',
        'Flushing minyak rem dan kalibrasi sensor TPS'
      ],
      telemetrySimulation: {
        engineHeat: '98° C (Tinggi)',
        compression: '9.8 PSI (Menurun)',
        voltage: '11.9 V (Perlu Dicek)',
        vibrationHz: '72 Hz (Unbalanced)'
      }
    };
  }

  if (hasGredeg || hasTarikanBerat || hasNgempos || count >= 2) {
    return {
      primaryIssue: 'Kontaminasi CVT & Penurunan Efisiensi Bahan Bakar',
      severity: 'Sedang',
      healthScore: 68,
      rootCause: `Gejala getaran CVT (gredeg) dan tarikan lambat pada ${brand} ${model || 'Matic'} disebabkan oleh gemuk CVT yang mengering/mengeras pada pulley sekunder dan penumpukan jelaga di ruang bakar.`,
      recommendedPackageId: 'regular-plus',
      estimatedCostRange: 'Rp 375.000',
      estimatedLaborTime: '60 - 75 Menit',
      partsToInspect: ['Roller Weight & Slider Bushing', 'Secondary Pulley Torque Cam', 'Throttle Body & Busi', 'Tekanan Fuel Pump'],
      actionPlan: [
        'Pembersihan menyeluruh ruang transmisi CVT dengan degreaser khusus',
        'Pemberian grease High-Temperature 300°C pada pin guide',
        'Diagnosis pembacaan voltmeter accu dan semprot Throttle Body cleaner'
      ],
      telemetrySimulation: {
        engineHeat: '88° C (Normal)',
        compression: '11.0 PSI (Baik)',
        voltage: '12.4 V (Optimal)',
        vibrationHz: '54 Hz (Moderate)'
      }
    };
  }

  return {
    primaryIssue: 'Perawatan Berkala Standar Lab & Preventif',
    severity: 'Ringan',
    healthScore: 86,
    rootCause: `Kondisi mesin ${brand} ${model || 'Matic'} dalam keadaan stabil. Membutuhkan refresh pelumasan sintetik dan pembersihan debu komuter harian.`,
    recommendedPackageId: 'paket-regular',
    estimatedCostRange: 'Rp 195.000',
    estimatedLaborTime: '45 Menit',
    partsToInspect: ['Oli Mesin & Gardan', 'Filter Udara', 'Kondisi Permukaan V-Belt'],
    actionPlan: [
      'Penggantian oli mesin grade laboratorium presisi',
      'Pembersihan filter udara & pengecekan tegangan aki',
      'Pemeriksaan tekanan ban dan safety check 21 titik'
    ],
    telemetrySimulation: {
      engineHeat: '82° C (Optimal)',
      compression: '11.8 PSI (Sempurna)',
      voltage: '12.6 V (Normal)',
      vibrationHz: '28 Hz (Halus)'
    }
  };
}
