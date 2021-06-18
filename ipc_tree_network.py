import networkx as nx
import os
import csv


input_path = r'C:\Users\bandk\Desktop\ipc_tree'
file_path_list_temp = []
data_list =[]
for dir_name, dirs, files in os.walk(input_path):
    file_path_list_temp.append([dir_name, files])
for x in file_path_list_temp[0][1]:
    with open(os.path.join(file_path_list_temp[0][0],x)) as infile:
        csv_reader = csv.reader(infile)
        headings = next(csv_reader)
        for row in csv_reader:
            data_list.append(row)
G = nx.Graph()
for x in data_list:
    if len(x) ==2:
        G.add_edge(x[0],x[1])
nx.write_graphml(G,r'C:\Users\bandk\Desktop\ipc_tree\ipc_tree.graphml')








