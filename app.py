import sys
from PySide2.QtWidgets import QApplication
from views.main_view import MainView


class App(QApplication):
    def __init__(self, sys_argv):
        super(App, self).__init__(sys_argv)
        self.view = MainView()
        self.view.show()


if __name__ == '__main__':
    app = App(sys.argv)
    app.exec_()
    sys.exit()