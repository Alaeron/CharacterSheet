from models.topbar_model import TopBarModel
from controllers.topbar_controller import TopBarController
from PySide2.QtWidgets import QMenuBar

class TopBarView(QMenuBar):
    def __init__(self, parent): 
        super().__init__(parent)
        self.model = TopBarModel()
        self.controller = TopBarController(self.model)

        for item in self.model.items:
            self.addMenu(item)
        self.adjustSize()
