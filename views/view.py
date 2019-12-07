from os.path import join

class View():
    def __init__():
        super().__init()

    def loadStyleSheet(self, path=None):
        # Determine file to load: given, or classname
        filepath = ''
        if path is None:
            filepath = join('styles', self.__class__.__name__ + '.qss')
        else:
            filepath = path

        with open(filepath) as stylesheet, open(join('styles', 'theme.qss')) as colors:

            # Assemble variable dictionary
            vars = {}
            for line in colors:
                # Ignore comments
                if line[0] is '#':
                    continue

                # Strip spaces and store pair
                pair = line.replace(' ', '').replace("  ", "").split('=')
                vars[pair[0]] = pair[1]

            # Read the styles and perform replacements
            styles = stylesheet.read()
            for key, value in vars.items():
                styles = styles.replace(key, value)

            # Set the stylesheet
            self.setStyleSheet(styles)