from selenium import webdriver

driver = webdriver.Chrome("c:/nxl/work/chromedriver.exe")

driver.get("https://www.google.com")

driver.find_element_by_xpath("//*[@id='tsf']/div[2]/div[1]/div[1]/div/div[2]/input").send_keys("test")


driver.find_element_by_xpath("//*[@id='gbw']/div/div/div[1]/div[1]/a").click()


