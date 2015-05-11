/*
 * Apllication Module
 *
 */

var angularIO = angular.module('angularIOApp', ['ngMaterial', 'ngRoute'])

//app Configuration routing
.config(['$routeProvider', '$mdThemingProvider',
function($routeProvider, $mdThemingProvider) {
    $routeProvider.when('/', {
        templateUrl : '/docs/js/latest/home.html'
    }).when('/local-environment-guide.html', {
        templateUrl : '/docs/js/latest/local-environment-guide.html'
    }).when('/va-moms-description.html', {
        templateUrl : '/docs/js/latest/va-moms-description.html'
    });

    $mdThemingProvider.theme('default').primaryPalette('blue', {
        'default' : '700', // by default use shade 400 from the pink palette for primary intentions
        'hue-1' : '100', // use shade 100 for the <code>md-hue-1</code> class
        'hue-2' : '600', // use shade 600 for the <code>md-hue-2</code> class
        'hue-3' : 'A100' // use shade A100 for the <code>md-hue-3</code> class
    })
    // If you specify less than all of the keys, it will inherit from the
    // default shades
    .accentPalette('purple', {
        'default' : '200' // use shade 200 for default, and keep all other shades the same
    });

}]);

/*
 * Menu Factory
 *
 */
angularIO.factory('menu', ['$location', '$rootScope',
function($location, $rootScope) {

    var sections = [{
        name : 'Getting Started',
        url : '/',
        type : 'link'
    }, {
        name : 'Local Environment Guide',
        url : '/local-environment-guide.html',
        type : 'link'
    }];

    sections.push({
        name : 'Example Applications',
        type : 'heading',
        children : [{
            name : 'VA Moms',
            type : 'toggle',
            pages : [{
                name : 'Guide',
                url : '/va-moms-description.html',
                type : 'link'
            }, {
                name : '1. Description and Installation',
                url : '/va-moms-description.html',
                type : 'link'
            }, {
                name : '2. Understanding Data',
                url : '/va-moms-description.html',
                type : 'link'
            }, {
                name : '3. Saving Data',
                url : '/va-moms-description.html',
                type : 'link'
            }, {
                name : '4. Retrieving Data',
                url : '/va-moms-description.html',
                type : 'link'
            }, {
                name : '5. Structuring Data',
                url : '/va-moms-description.html',
                type : 'link'
            }, {
                name : '6. Understanding Security',
                url : '/va-moms-description.html',
                type : 'link'
            }, {
                name : '7. App Deployment',
                url : '/va-moms-description.html',
                type : 'link'
            }, {
                name : 'API Reference',
                url : '/docs/js/latest/va-moms-reference.html',
                type : 'link'
            }]
        }, {
            name : 'Maternity Care Coordinator',
            type : 'toggle',
            pages : [{
                name : 'Guide',
                url : '/va-moms-description.html',
                type : 'link'
            }, {
                name : '1. Description and Installation',
                url : '/va-moms-description.html',
                type : 'link'
            }, {
                name : '2. Understanding Data',
                url : '/va-moms-description.html',
                type : 'link'
            }, {
                name : '3. Saving Data',
                url : '/va-moms-description.html',
                type : 'link'
            }, {
                name : '4. Retrieving Data',
                url : '/va-moms-description.html',
                type : 'link'
            }, {
                name : '5. Structuring Data',
                url : '/va-moms-description.html',
                type : 'link'
            }, {
                name : '6. Understanding Security',
                url : '/va-moms-description.html',
                type : 'link'
            }, {
                name : '7. App Deployment',
                url : '/va-moms-description.html',
                type : 'link'
            }, {
                name : 'API Reference',
                url : '/docs/js/latest/mcc-reference.html',
                type : 'link'
            }]
        }]
    });

    sections.push({
        name : 'API Reference',
        type : 'heading',
        children : [{
            name : 'Layout',
            type : 'toggle',
            pages : [{
                name : 'Container Elements',
                id : 'layoutContainers',
                url : '/layout/container'
            }, {
                name : 'Grid System',
                id : 'layoutGrid',
                url : '/layout/grid'
            }, {
                name : 'Child Alignment',
                id : 'layoutAlign',
                url : '/layout/alignment'
            }, {
                name : 'Options',
                id : 'layoutOptions',
                url : '/layout/options'
            }]
        }]
    });

    function sortByName(a, b) {
        return a.name < b.name ? -1 : 1;
    }

    var self;

    $rootScope.$on('$locationChangeSuccess', onLocationChange);

    return self = {
        sections : sections,

        selectSection : function(section) {
            self.openedSection = section;
        },
        toggleSelectSection : function(section) {
            self.openedSection = (self.openedSection === section ? null : section);
        },
        isSectionSelected : function(section) {
            return self.openedSection === section;
        },

        selectPage : function(section, page) {
            page && page.url && $location.path(page.url);
            self.currentSection = section;
            self.currentPage = page;
        },
        isPageSelected : function(page) {
            return self.currentPage === page;
        }
    };

    function sortByHumanName(a, b) {
        return (a.humanName < b.humanName) ? -1 : (a.humanName > b.humanName) ? 1 : 0;
    }

    function onLocationChange() {
        var path = $location.path();

        var matchPage = function(section, page) {
            if (path === page.url) {
                self.selectSection(section);
                self.selectPage(section, page);
            }
        };

        sections.forEach(function(section) {
            if (section.children) {
                // matches nested section toggles, such as API or Customization
                section.children.forEach(function(childSection) {
                    if (childSection.pages) {
                        childSection.pages.forEach(function(page) {
                            matchPage(childSection, page);
                        });
                    }
                });
            } else if (section.pages) {
                // matches top-level section toggles, such as Demos
                section.pages.forEach(function(page) {
                    matchPage(section, page);
                });
            } else if (section.type === 'link') {
                // matches top-level links, such as "Getting Started"
                matchPage(section, section);
            }
        });
    }

}]).directive('menuLink', function() {
    return {
        scope : {
            section : '='
        },
        templateUrl : '/docs/templates/menu-link.html',
        link : function($scope, $element) {
            var controller = $element.parent().controller();

            $scope.isSelected = function() {
                return controller.isSelected($scope.section);
            };
        }
    };
}).directive('menuToggle', function() {
    return {
        scope : {
            section : '='
        },
        templateUrl : '/docs/templates/menu-toggle.html',
        link : function($scope, $element) {
            var controller = $element.parent().controller();

            $scope.isOpen = function() {
                return controller.isOpen($scope.section);
            };
            $scope.toggle = function() {
                controller.toggleOpen($scope.section);
            };

            var parentNode = $element[0].parentNode.parentNode.parentNode;
            if (parentNode.classList.contains('parent-list-item')) {
                var heading = parentNode.querySelector('h2');
                $element[0].firstChild.setAttribute('aria-describedby', heading.id);
            }
        }
    };
}).filter('humanizeDoc', function() {
    return function(doc) {
        if (!doc)
            return;
        if (doc.type === 'directive') {
            return doc.name.replace(/([A-Z])/g, function($1) {
                return '-' + $1.toLowerCase();
            });
        }
        return doc.label || doc.name;
    };
}).filter('nospace', function() {
    return function(value) {
        return (!value) ? '' : value.replace(/ /g, '');
    };
});

angularIO.directive('prettify', function() {
    return {
        restrict : 'E',
        link : function postLink(scope, element, attrs) {
            prettyPrint();
        }
    };
});
/*
 * Apllication Controller
 *
 */

angularIO.controller('AppCtrl', ['$scope', '$mdDialog', '$mdMedia', 'menu', '$location', '$rootScope', '$timeout', '$mdSidenav',
function($scope, $mdDialog, $mdMedia, menu, $location, $rootScope, $timeout, $mdSidenav) {

    var self = this;

    $rootScope.$mdMedia = $mdMedia;
    $scope.menu = menu;
    $scope.path = path;
    $scope.goHome = goHome;
    $scope.openMenu = openMenu;
    $scope.closeMenu = closeMenu;
    $scope.isSectionSelected = isSectionSelected;

    $rootScope.$on('$locationChangeSuccess', openPage);

    // Methods used by menuLink and menuToggle directives
    this.isOpen = isOpen;
    this.isSelected = isSelected;
    this.toggleOpen = toggleOpen;

    var mainContentArea = document.querySelector("[role='main']");

    // *********************
    // Internal methods
    // *********************

    function closeMenu() {
        $timeout(function() {
            $mdSidenav('left').close();
        });
    }

    function openMenu() {
        $timeout(function() {
            $mdSidenav('left').open();
        });
    }

    function path() {
        return $location.path();
    }

    function goHome($event) {
        menu.selectPage(null, null);
        $location.path('/');
    }

    function openPage() {
        $scope.closeMenu();
    }

    function isSelected(page) {
        return menu.isPageSelected(page);
    }

    function isSectionSelected(section) {
        var selected = false;
        var openedSection = menu.openedSection;
        if (openedSection === section) {
            selected = true;
        } else if (section.children) {
            section.children.forEach(function(childSection) {
                if (childSection === openedSection) {
                    selected = true;
                }
            });
        }
        return selected;
    }

    function isOpen(section) {
        return menu.isSectionSelected(section);
    }

    function toggleOpen(section) {
        menu.toggleSelectSection(section);
    }

    // TOGGLE MAIN NAV (TOP) ON MOBILE
    $scope.toggleDocsMenu = function(event) {
        $scope.showDocsNav = !$scope.showDocsNav;
    };

    // TOGGLE DOCS NAV
    $scope.toggleMainMenu = function(event) {
        $scope.showMainNav = !$scope.showMainNav;
    };

    // TOGGLE DOCS VERSION & LANGUAGE
    $scope.toggleVersionMenu = function(event) {
        $scope.showMenu = !$scope.showMenu;
    };

    // BIO MODAL
    $scope.showBio = function($event) {
        var parentEl = angular.element(document.body);
        var person = angular.element($event.currentTarget);
        var name = person.attr('data-name');
        var bio = person.attr('data-bio');
        var pic = person.attr('data-pic');
        var twitter = person.attr('data-twitter');
        var website = person.attr('data-website');
        var $twitter = twitter !== 'undefined' ? '<a class="button button-subtle button-small" href="https://twitter.com/' + person.attr('data-twitter') + '" md-button>Twitter</a>' : '';
        var $website = website !== 'undefined' ? '<a class="button button-subtle button-small" href="' + person.attr('data-website') + '" md-button>Website</a>' : '';

        $mdDialog.show({
            parent : parentEl,
            targetEvent : $event,
            template : '<md-dialog class="modal" aria-label="List dialog">' + '  <md-content>' + '     <img class="left" src="' + pic + '" />' + '     <h3 class="text-headline">' + name + '</h3>' + '     <div class="modal-social">' + $twitter + $website + '</div>' + '     <p class="text-body">' + bio + '</p>' + '  </md-content>' + '  <div class="md-actions">' + '    <md-button ng-click="closeDialog()">' + '      Close Bio' + '    </md-button>' + '  </div>' + '</md-dialog>',
            locals : {
                items : $scope.items
            },
            controller : DialogController
        });

        function DialogController(scope, $mdDialog, items) {
            scope.items = items;
            scope.closeDialog = function() {
                $mdDialog.hide();
            };
        }

    };

    // INITIALIZE PRETTY PRINT
    prettyPrint();
}]);

