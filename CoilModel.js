/*
    CoilChoice/CoilModel.js: A physical and electrical model of a magnetic coil
    Copyright (C) 2015  Robert L. Read

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// A plain old object containing the non-computed parameters of a
//  coil, and functions computing some other parameters.

var AWG_data = [];

// Note: This data is provisional based on a single manufacturer
// http://media.digikey.com/pdf/Data%20Sheets/CNC%20Tech%20PDFs/MW35C_Spec.pdf

AWG_data[46] = { OhmsPerMM: 16122 / 1000000,
		 WireDiameter: 0.0533 };

AWG_data[44] = { OhmsPerMM: 9529 / 1000000,
		 WireDiameter: 0.069 };

AWG_data[42] = { OhmsPerMM: 5900 / 1000000,
		 WireDiameter: 0.081 };

AWG_data[40] = { OhmsPerMM: 3801 / 1000000,
		 WireDiameter: 0.101 };

AWG_data[38] = { OhmsPerMM: 1428 / 1000000,
		 WireDiameter: 0.160 };

AWG_data[36] = { OhmsPerMM: 1428 / 1000000,
		 WireDiameter: 0.160 };

AWG_data[34] = { OhmsPerMM: 890.6 / 1000000,
		 WireDiameter: 0.198 };

AWG_data[32] = { OhmsPerMM: 543.4 / 1000000,
		 WireDiameter: 0.249 };

AWG_data[30] = { OhmsPerMM: 348.5 / 1000000,
		 WireDiameter: 0.302 };

AWG_data[28] = { OhmsPerMM: 217.1 / 1000000,
		 WireDiameter: 0.373 };

AWG_data[26] = { OhmsPerMM: 137.9 / 1000000,
		 WireDiameter: 0.462 };

AWG_data[24] = { OhmsPerMM: 86.08 / 1000000,
		 WireDiameter: 0.577 };

AWG_data[22] = { OhmsPerMM: 54.44 / 1000000,
		 WireDiameter: 0.714 };

AWG_data[20] = { OhmsPerMM: 33.88 / 1000000,
		 WireDiameter: 0.892 };

AWG_data[18] = { OhmsPerMM: 21.39 / 1000000,
		 WireDiameter: 1.110 };

AWG_data[16] = { OhmsPerMM: 13.44 / 1000000,
		 WireDiameter: 1.384 };

AWG_data[14] = { OhmsPerMM: 8.437 / 1000000,
		 WireDiameter: 1.732 };

AWG_data[12] = { OhmsPerMM: 5.316 / 1000000,
		 WireDiameter: 2.163 };

AWG_data[10] = { OhmsPerMM: 3.342 / 1000000,
		 WireDiameter: 2.703 };

var AWG_indexes = [ 10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46 ];

function CoilModel() {
  // POWER SOURCE
  // Voltage of power source in Volts
  this.Voltage = 12,
  // Internal Resistance of battery
  //      InternalResistance = 0.025,
  this.InternalResistance = 0.025,

  // WIRE PARAMETERS
  // American Wire Gauge. Not really a variable, since we don't 
  // have an official table, but informational.
  this.AWG = 32,
  // Ohms/mm
  this.OhmsPerMM = function() {
	return AWG_data[this.AWG].OhmsPerMM;
  },
  // Outer diameter of insulated wire in mm
  this.WireDiameter = function() {
	return AWG_data[this.AWG].WireDiameter;
  },

  // Bobbin parameters (all in mm)
  this.BobbinInnerDiameter = 12,
  this.BobbinOuterDiameter = 12.5,
  this.BobbinLength = 12
}

function computeFromModel(model) {

  var Windings = (model.BobbinOuterDiameter - model.BobbinInnerDiameter) / model.WireDiameter();
  var TurnsPerWinding = model.BobbinLength / model.WireDiameter();
  var Turns = Windings * TurnsPerWinding;
  var AverageTurnDiameter = (model.BobbinOuterDiameter + model.BobbinInnerDiameter) / 2.0;
  var AverageTurnLength = AverageTurnDiameter * Math.PI;
  var WireLengthIn_mm = Turns * AverageTurnLength;
  var CoilResistance = WireLengthIn_mm * model.OhmsPerMM();
  var TotalResistance = model.InternalResistance + CoilResistance;
  var Amperage = model.Voltage / TotalResistance ;
  var VoltageDropInCoil = model.Voltage * (CoilResistance / TotalResistance);
  var VoltageDropInBattery = model.Voltage - VoltageDropInCoil;
  var InternalHeat = VoltageDropInBattery * Amperage;
  var CoilHeat = VoltageDropInCoil * Amperage;
  var MMF_amp_turns = Turns * Amperage;
  var EffectiveMMF = MMF_amp_turns*(Math.pow(model.BobbinInnerDiameter,2)/Math.pow(AverageTurnDiameter,2));

  return {
    Model: model,
    Windings : Windings,
    TurnsPerWinding : TurnsPerWinding,
    Turns : Turns,
    AverageTurnDiameter : AverageTurnDiameter,
    AverageTurnLength : AverageTurnLength,
    WireLengthIn_mm : WireLengthIn_mm,
    CoilResistance : CoilResistance,
    TotalResistance : TotalResistance,
    Amperage : Amperage,
    VoltageDropInCoil : VoltageDropInCoil,
    VoltageDropInBattery : VoltageDropInBattery,
    InternalHeat : InternalHeat,
    CoilHeat : CoilHeat,
    MMF_amp_turns : MMF_amp_turns,
    EffectiveMMF : EffectiveMMF,
  }
}

function renderAsHTML(m) {
    var result = "";
    result += "<table>\n";

    result += "<tr>\n";
    result += "<td>\n";
    result += "MMF (Ampere Turns) : ";
    result += "</td>\n";
    result += "<td>\n";
    result += m.MMF_amp_turns.toFixed(2);
    result += "</td>\n";
    result += "</tr>\n";

    result += "<tr>\n";
    result += "<td>\n";
    result += "Effective MMF : ";
    result += "</td>\n";
    result += "<td>\n";
    result += m.EffectiveMMF.toFixed(2);
    result += "</td>\n";
    result += "</tr>\n";

    result += "<tr>\n";
    result += "<td>\n";
    result += "Amperage: ";
    result += "</td>\n";
    result += "<td>\n";
    result += m.Amperage.toFixed(2);
    result += "</td>\n";
    result += "</tr>\n";

    result += "<tr>\n";
    result += "<td>\n";
    result += "CoilHeat (Watts): ";
    result += "</td>\n";
    result += "<td>\n";
    result += m.CoilHeat.toFixed(2);
    result += "</td>\n";
    result += "</tr>\n";

    result += "<tr>\n";
    result += "<td>\n";
    result += "AWG: ";
    result += "</td>\n";
    result += "<td>\n";
    result += " "+m.Model.AWG;
    result += "</td>\n";
    result += "</tr>\n";

    result += "<tr>\n";
    result += "<td>\n";
    result += "Bobbin Outer Diameter (mm): ";
    result += "</td>\n";
    result += "<td>\n";
    result += " "+m.Model.BobbinOuterDiameter.toFixed(2);
    result += "</td>\n";
    result += "</tr>\n";

    result += "</table>\n";
    return result;
}
