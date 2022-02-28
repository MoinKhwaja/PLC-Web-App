import json, time, random
import numpy as np

from datetime import datetime
from numpy.core.defchararray import add
from numpy.matrixlib.defmatrix import matrix
from pymodbus.client.sync import ModbusTcpClient
from pymodbus.constants import Endian
from pymodbus.payload import BinaryPayloadBuilder, BinaryPayloadDecoder
from flask import Flask, Response, render_template, request, url_for, redirect, jsonify, make_response

 

application = Flask(__name__)

#main page and function
#initiate homepage
@application.route("/")
def index():
    return render_template("overview.html")

#reads PLC data and packages it as JSON
def readData():
    client = ModbusTcpClient(#PLC IP Adress)
    client.connect()
    addressList = [#PLC Data Registers]
    


    while True: 
        dataList = []
        for i in range(len(addressList)):
            result = client.read_holding_registers(addressList[i],2,unit=0)
            decoder = BinaryPayloadDecoder.fromRegisters(result.registers, byteorder= Endian.Big, wordorder= Endian.Big)
            dataList.append(decoder.decode_32bit_float())
        json_data = json.dumps(
            {
                "example 1": dataList[0],
                "example 2": dataList[1],
                "example 3": dataList[2],
                

            }
        )
        yield f"data:{json_data}\n\n"
        time.sleep(1)

        

#reinitiates homepage for when the user moves to other pages
@application.route("/test.html")
def index4():
    return render_template("test.html")

#sends data to front-end
@application.route("/chart-data")
def chart_data():
    return Response(readData(), mimetype="text/event-stream")

#recieves example data from frontend and sends to PLC
@application.route("/exampleSend", methods=['POST'])
def sentData():

    modbus_obj = ModbusTcpClient(#IP Address)
    req = request.get_json()
    print(req)
    try:
        numwrite = float(req["example"])
        print(numwrite)
        builder = BinaryPayloadBuilder(byteorder=Endian.Big, wordorder=Endian.Big)
        builder.add_32bit_float(numwrite)
        registers = builder.to_registers()
        modbus_obj.write_registers(#PLC Register, registers, unit=0)
    except:
        print('bad update')

    res = make_response(jsonify({"message":"JSON recieved"}), 200)
    
    return res



#starts program and specifies port
if __name__ == "__main__":
    application.run(debug=True, threaded=True, port=5000)