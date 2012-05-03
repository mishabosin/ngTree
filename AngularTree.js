/**
 * @ngdoc directive
 * @name ngTree
 *
 * @description
 * The `ngTree` directive instantiates a template once per item for a tree based structure.
 * Each template instance gets its own scope, where the given loop variable is set to the
 * current collection item.
 *
 * @element ANY
 * @param ngTree - the top level (root) object to
 * @param nodeChildren - the property of the root object that contains the child elements.
 *      Has to reference an array of objects.
 * @param nodeOrder - used by ngRepeat to set the order in which the nodes are displayed
 */
angular.module('TreeModule', []).directive('ngTree', function($compile) {
    return {
        transclude: false,
        terminal: true,
        compile: function(element, attr, linker) {
            return function(scope, parentElement, attr) {
                var treeExp = attr.ngTree;
                // TODO: validate the expressions
                var childrenExp = attr.nodeChildren;
                var orderExp = attr.nodeOrder;
                var childScope;

                scope.$watch(treeExp, function(parentNode){
                    var childrenHtml;
                    if (parentNode) {
                        childScope = scope.$new();
                        childScope[treeExp] = parentNode;

                        // Construct the branch html
                        if (parentNode[childrenExp] == null) {
                            // No children - this is a terminal node
                            childrenHtml = "";
                        } else {
                            // Construct a repeater for the children
                            var repeaterString = "<span ng-repeat='"+treeExp+" in "+treeExp+"."+childrenExp+" | orderBy:"+'"'+orderExp+'"'+"'></span>";
                            var $repeater = angular.element(repeaterString);
                            // Inject the provided template into the repeater to initiate the recursion
                            childrenHtml = $repeater.append(parentElement.clone());
                        }

                        // Add and compile the result
                        parentElement.find("ng-tree-child").replaceWith(childrenHtml);
                        $compile(parentElement.contents())(childScope);
                    }
                });
            };
        }
    };
});