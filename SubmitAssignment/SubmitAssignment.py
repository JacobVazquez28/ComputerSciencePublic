from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.relative_locator import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium import webdriver
from bs4 import BeautifulSoup
import itertools
import os

def xpath_soup(element):
    """
    Generate xpath of soup element
    :param element: bs4 text or node
    :return: xpath as string
    """
    components = []
    child = element if element.name else element.parent
    for parent in child.parents:
        """
        @type parent: bs4.element.Tag
        """
        previous = itertools.islice(parent.children, 0, parent.contents.index(child))
        xpath_tag = child.name
        xpath_index = sum(1 for i in previous if i.name == xpath_tag) + 1
        components.append(xpath_tag if xpath_index == 1 else '%s[%d]' % (xpath_tag, xpath_index))
        child = parent
    components.reverse()
    return '/%s' % '/'.join(components)

script_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(script_dir, 'AlreadySubmitted.txt')
file = open(file_path, 'a+')
file.seek(0)
already_submitted = file.read().splitlines()

if not already_submitted:
    file.write(f'{input('insert link to your cs course page: ')}\n')

driver = webdriver.Edge()
wait = WebDriverWait(driver, 10)

file.seek(0)
schoology_page_link = file.readline()

driver.get(schoology_page_link)

wait.until(EC.element_to_be_clickable((By.CLASS_NAME, 'upcoming-event')))

#making soup and list of assingments
soup = BeautifulSoup(driver.page_source, 'html.parser')
assignment_list = soup.find_all(class_='upcoming-event')

for soup_elem in assignment_list:
    #getting xpath for link elem with bs4 and feeding to selenium
    soup_elem = soup_elem.find_next('a')
    elem = driver.find_element(By.XPATH, xpath_soup(soup_elem))

    #checking whether soup_elem is codeHS assignment
    try:
        int(soup_elem.text[0])
    except ValueError:
        continue

    #checking whether assignment has already been submitted
    if soup_elem.text not in already_submitted:
        file.write(f'{soup_elem.text}\n')
    else: 
        continue
    
    #opening link in new tab and switching to it
    href = elem.get_attribute('href')
    driver.execute_script("window.open(arguments[0]);", href)
    driver.switch_to.window(driver.window_handles[1])

    #switching focus to codeHS iframe and opening
    driver.switch_to.frame(0)
    wait.until(EC.element_to_be_clickable((By.CLASS_NAME, 'btn-main')))
    to_codeHS = driver.find_element(By.CLASS_NAME, 'btn-main')
    to_codeHS.click()
    driver.switch_to.parent_frame

    #switching to and waiting for codeHS tab to load
    driver.switch_to.window(driver.window_handles[2])
    wait.until(EC.element_to_be_clickable((By.CLASS_NAME, 'icon-home')))

    #closing all opened tabs and switching back to schoology tab
    driver.close()
    driver.switch_to.window(driver.window_handles[1])
    driver.close()
    driver.switch_to.window(driver.window_handles[0])

print('complete')
file.close()
driver.quit()