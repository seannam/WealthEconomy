﻿(function () {
    'use strict';

    var controllerId = 'AllInOneController';
    angular.module('main')
        .controller(controllerId, ['logger', 'resourcePoolFactory', '$scope', AllInOneController]);

    function AllInOneController(logger, resourcePoolFactory, $scope) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.allInOneConfig = { userName: 'sample', resourcePoolKey: 'All-in-One' };

        // Event listeners
        $scope.$on('resourcePoolEditor_elementCellNumericValueIncreased', processNewInteraction);
        $scope.$on('resourcePoolEditor_elementCellNumericValueDecreased', processNewInteraction);
        $scope.$on('resourcePoolEditor_elementCellNumericValueReset', processNewInteraction);

        _init();

        function _init() {
            processExistingInteraction();
        }

        // Processes whether the current user had already interacted with this example
        function processExistingInteraction() {
            // Priority & Knowledge Index examples copy their ratings to this one
            // However if the user starts directly playing ..
            resourcePoolFactory.getResourcePoolExpanded(vm.allInOneConfig)
                .then(function (resourcePool) {
                    // Elements
                    for (var elementIndex = 0; elementIndex < resourcePool.ElementSet.length; elementIndex++) {
                        var element = resourcePool.ElementSet[elementIndex];
                        // Element fields
                        for (var elementFieldIndex = 0; elementFieldIndex < element.ElementFieldSet.length; elementFieldIndex++) {
                            var elementField = element.ElementFieldSet[elementFieldIndex];
                            // Element cells
                            for (var elementCellIndex = 0; elementCellIndex < elementField.ElementCellSet.length; elementCellIndex++) {
                                var elementCell = elementField.ElementCellSet[elementCellIndex];

                                if (elementCell.currentUserCell()) {
                                    resourcePool.userInteracted = true;
                                    return;
                                }
                            }
                        }
                    }
                });
        }

        // Processes whether the user is currently interacting with this example
        function processNewInteraction(event, cell) {
            if (cell.ElementField.Element.ResourcePool.User.UserName === vm.allInOneConfig.userName && cell.ElementField.Element.ResourcePool.Key === vm.allInOneConfig.resourcePoolKey) {
                cell.ElementField.Element.ResourcePool.userInteracted = true;
                return;
            }
        }
    }
})();
