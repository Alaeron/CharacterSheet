from PySide2.QtWidgets import QMenu

class TopBarModel():
    def __init__(self):
        super().__init__()
        self.items = [
            QMenu("File"), 
            QMenu("Edit"),
            QMenu("Help")
            ]