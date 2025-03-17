export interface PatientsJsonInterface {
  차트번호?: number;
  이름: string;
  전화번호: number;
  주민등록번호?: string;
  주소?: string;
  메모?: string;
}

export interface CreatePatientsResponseInterface {
  result: boolean;
  effectedRawCount?: number;
}