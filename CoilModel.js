// A plain old object containing the non-computed parameters of a
//  coil, and functions computing some other parameters.

var AWG_data = [];

// Note: This data is provisional based on a single manufacturer
// http://media.digikey.com/pdf/Data%20Sheets/CNC%20Tech%20PDFs/MW35C_Spec.pdf
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

var AWG_indexes = [ 18,20,22,24,26,28,30,32 ];

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
  this.BobbinLength = 12,
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
    result += "Bobbin Outer Diameter (mm) ";
    result += "</td>\n";
    result += "<td>\n";
    result += " "+m.Model.BobbinOuterDiameter.toFixed(2);
    result += "</td>\n";
    result += "</tr>\n";

    result += "</table>\n";
    return result;
}
