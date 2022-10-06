export interface Today {
	confirm: number;
	suspect?: any;
	heal: number;
	dead: number;
	severe?: any;
	storeConfirm: number;
	input: number;
}

export interface Total {
	confirm: number;
	suspect: number;
	heal: number;
	dead: number;
	severe: number;
	input: number;
}

export interface ExtData {
	noSymptom: number;
	incrNoSymptom: number;
}

export interface ChinaTotal {
	today: Today;
	total: Total;
	extData: ExtData;
}

export interface Today {
	confirm: number;
	suspect: number;
	heal: number;
	dead: number;
	severe?: any;
	storeConfirm: number;
	input: number;
}

export interface Total {
	confirm: number;
	suspect: number;
	heal: number;
	dead: number;
	severe?: any;
	input: number;
	storeConfirm: number;
}

export interface ChinaDayList {
	date: string;
	today: Today;
	total: Total;
	extData?: any;
	lastUpdateTime?: any;
}

export interface Today {
	confirm: number;
	suspect?: any;
	heal: number;
	dead: number;
	severe?: any;
	storeConfirm?: any;
}

export interface Total {
	confirm: number;
	suspect: number;
	heal: number;
	dead: number;
	severe: number;
	input: number;
}

export interface ExtData {}

export interface AreaTree {
	today: Today;
	total: Total;
	extData: ExtData;
	name: string;
	id: string;
	lastUpdateTime: string;
	children: any[];
}

export interface RootObject {
	chinaTotal: ChinaTotal;
	chinaDayList: ChinaDayList[];
	lastUpdateTime: string;
	overseaLastUpdateTime: string;
	areaTree: AreaTree[];
}