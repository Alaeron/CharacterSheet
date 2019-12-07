from PySide2.QtWidgets import QMainWindow
from models.main_model import MainModel
from controllers.main_controller import MainController
from views.view import View
from views.topbar_view import TopBarView

class MainView(QMainWindow, View):
    def __init__(self):
        super().__init__()

        # Init Model, View
        self.model = MainModel()
        self.controller = MainController(self.model)

        # Basic view properties
        self.setWindowTitle("Character Sheet")
        self.setGeometry(50, 50, 1280, 720)

        # Load Styles
        self.loadStyleSheet()

        # Add Widgets
        self.menu = TopBarView(self)
        