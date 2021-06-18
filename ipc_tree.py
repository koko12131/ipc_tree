from selenium import webdriver
import os
from selenium.webdriver.chrome.options import Options
options = webdriver.ChromeOptions()
options.add_argument('headless')


def createListCSV(fileName='', dataList=[]):
    with open(fileName, 'w', newline='') as csvFile:
        import csv
        csvWriter = csv.writer(csvFile)
        csvWriter.writerow(['Source','Target'])
        for data in dataList:
            csvWriter.writerow(data)
        csvFile.close

def outCSV(filename,data_list=[]):
    r=filename+'.csv'
    createListCSV(r,data_list)

def ipc_hierarchical_mark_f(file_path,ipc4):
    url = 'file://' + file_path
    browser = webdriver.Chrome(chrome_options=options)
    browser.get(url)
    h = browser.find_elements_by_tag_name('td')
    datalist = []
    for x in h:
        if x.text.startswith(ipc4) or x.text.startswith('•'):
            datalist.append(x.text.strip())
        ipc_hierarchical_mark_list = []
    for x in datalist:
        if x.startswith(ipc4) and datalist.index(x) + 1 < len(datalist) and not datalist[datalist.index(x) + 1].startswith('•') :
            if len(x.split('/')) == 1:
                ipc_hierarchical_mark_list.append([x, 0])
            elif x.split('/')[-1] == '00':
                ipc_hierarchical_mark_list.append([x, 1])
        elif x.startswith(ipc4) and datalist.index(x) + 1 < len(datalist) and datalist[datalist.index(x) + 1].startswith('•'):
            mark = 0
            for y in datalist[datalist.index(x) + 1]:
                if y == '•':
                    mark = mark + 1
            # print([x, mark])
            ipc_hierarchical_mark_list.append([x, mark + 1])
    tree_list =[]
    for x in ipc_hierarchical_mark_list[1:]:
        tree_list.append(tree_list_f(ipc_hierarchical_mark_list.index(x),ipc_hierarchical_mark_list))
    browser.close()
    return tree_list

def tree_list_f(x_index,datalist):
    k = x_index
    t_list = []
    for y in range(x_index-1,-1,-1):
        if datalist[y][1] == datalist[k][1]-1:
            t_list=[datalist[y][0],datalist[k][0]]
            break
    return t_list

def file_name_tree_list_f(input_path):
    file_path_list_temp = []
    for dir_name, dirs, files in os.walk(input_path):
        file_path_list_temp.append([dir_name, files])
    file_name_mark_temp = []
    file_path_list = []
    for x in file_path_list_temp[0][1]:
        if len(x.split('.')[0]) == 4:
            file_path_list.append(os.path.join(file_path_list_temp[0][0], x))
            file_name_mark_temp.append((x.split('.')[0], 2))
        elif len(x.split('.')[0]) == 1:
            file_name_mark_temp.append((x.split('.')[0], 0))
        elif len(x.split('.')[0]) == 3:
            file_name_mark_temp.append((x.split('.')[0], 1))
    file_name_mark = sorted(file_name_mark_temp)
    file_name_tree_list = []
    for x in file_name_mark:
        if x[1] == 0:
            continue
        else:
            k = tree_list_f(file_name_mark.index(x), file_name_mark)
            file_name_tree_list.append(k)
    return file_path_list,file_name_tree_list

def main():
    input_path = r'C:\Users\bandk\Downloads\Compressed\en_20200101_html'
    output_path = r'C:\Users\bandk\Desktop\ipc_tree'
    file_path_list,file_name_tree_list = file_name_tree_list_f(input_path)
    outCSV(os.path.join(output_path, 'ipc4_upper'), file_name_tree_list)
    for x in file_path_list:
        ipc4 = x.split(os.sep)[-1].split('.')[0]
        #print(ipc4)
        ipc_tree_list = ipc_hierarchical_mark_f(x,ipc4)
        outCSV(os.path.join(output_path,ipc4),ipc_tree_list)

if __name__ == '__main__':
    main()






